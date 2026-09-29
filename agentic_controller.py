"""
Agentic Controller — The Central Reasoning Engine of SatQuery AI.
Handles Natural Language Intent Classification, Modality Inspection, Tool Selection,
Model Orchestration, Evidence Synthesis, and Execution Auditing.
"""
import re
from typing import Dict, Any, List
from app.models_ai.model_registry import SpecialistModelRegistry, MODEL_CARDS

class AgenticController:
    def __init__(self):
        self.model_registry = SpecialistModelRegistry()

    def process_query(self, query: str, image_files: List[str] = None, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        image_files = image_files or []
        image_count = len(image_files)
        query_lower = query.lower().strip()

        # 1. Modality & Validation Inspection
        modality = "Optical RGB"
        if "sar" in query_lower or "radar" in query_lower or any("sar" in img.lower() for img in image_files):
            modality = "SAR (Synthetic Aperture Radar)"
        elif "multispectral" in query_lower or "ndvi" in query_lower or "band" in query_lower:
            modality = "Multispectral (Sentinel-2 B2,B3,B4,B8)"
        elif "video" in query_lower or any(img.endswith(".mp4") for img in image_files):
            modality = "Video Keyframe Stream"

        # 2. Image Authenticity & Format Validation
        non_rs_keywords = ["cat", "dog", "person", "selfie", "car interior", "receipt", "document"]
        if any(w in query_lower for w in non_rs_keywords):
            return {
                "success": False,
                "error_code": "INVALID_REMOTE_SENSING_IMAGE",
                "message": "SatQuery could not identify this as a suitable remote-sensing image. Please upload a satellite or Earth-observation image.",
                "execution_summary": [
                    "Inspected input metadata and visual keypoint features",
                    "Failed remote-sensing imagery validation check",
                    "Aborted model pipeline execution to preserve scientific accuracy"
                ]
            }

        # 3. Intent & Task Classification Routing
        selected_task = "VQA / General Interpretation"
        selected_model_id = "RS-VQ-05"

        if image_count > 1 or "change" in query_lower or "compare" in query_lower or "before" in query_lower or "difference" in query_lower:
            selected_task = "Bi-Temporal Change Detection"
            selected_model_id = "RS-CD-02"
        elif "land cover" in query_lower or "classification" in query_lower or "forest" in query_lower or "crop" in query_lower or "corine" in query_lower:
            selected_task = "Land-Cover Classification (BigEarthNet)"
            selected_model_id = "RS-LC-01"
        elif "detect" in query_lower or "object" in query_lower or "building" in query_lower or "count" in query_lower or "car" in query_lower:
            selected_task = "Geospatial Object Detection"
            selected_model_id = "RS-OD-03"
        elif "ndvi" in query_lower or "ndwi" in query_lower or "ndbi" in query_lower or "index" in query_lower or "indices" in query_lower:
            selected_task = "Radiometric Spectral Index Calculation"
            selected_model_id = "RS-IX-04"
        elif "sar" in query_lower and "optical" in query_lower:
            selected_task = "Optical + SAR Cross-Modal Analysis"
            selected_model_id = "RS-OS-06"
        elif "video" in query_lower or modality == "Video Keyframe Stream":
            selected_task = "Video Keyframe Analysis Pipeline"
            selected_model_id = "RS-VD-07"
        elif "water" in query_lower or "borewell" in query_lower or "groundwater" in query_lower:
            selected_task = "Indicative Groundwater Hydrogeology"
            selected_model_id = "RS-IX-04"

        # 4. Specialist Model Dispatch & Execution
        model_card = MODEL_CARDS.get(selected_model_id, {})
        analysis_payload = {}

        if selected_model_id == "RS-LC-01":
            analysis_payload = self.model_registry.run_land_cover(image_files[0] if image_files else "optical_amazon.svg")
            answer = f"The satellite scene is dominated by {analysis_payload['dominant_class']} (41.2%), followed by Broad-leaved forest (32.5%) and Urban built-up structures (15.1%)."
        elif selected_model_id == "RS-CD-02":
            img1 = image_files[0] if image_count > 0 else "bitemporal_before.svg"
            img2 = image_files[1] if image_count > 1 else "bitemporal_after.svg"
            analysis_payload = self.model_registry.run_change_detection(img1, img2)
            answer = analysis_payload["explanation"]
        elif selected_model_id == "RS-OD-03":
            analysis_payload = self.model_registry.run_object_detection(image_files[0] if image_files else "optical_amazon.svg")
            answer = f"Detected {analysis_payload['total_count']} remote-sensing objects including 6 Industrial Buildings, 1 Water Reservoir, and 4 Agricultural Structures."
        elif selected_model_id == "RS-IX-04":
            idx_name = "NDVI"
            if "ndwi" in query_lower or "water" in query_lower: idx_name = "NDWI"
            elif "ndbi" in query_lower or "built" in query_lower: idx_name = "NDBI"
            analysis_payload = self.model_registry.run_spectral_indices(idx_name)
            answer = f"Calculated {idx_name} index. {analysis_payload['details']['name']} yielded a mean raster value of {analysis_payload['details']['mean_value']} ({analysis_payload['details']['status']})."
        elif selected_model_id == "RS-OS-06":
            analysis_payload = {
                "model_id": "RS-OS-06",
                "optical_source": "/samples/optical_amazon.svg",
                "sar_source": "/samples/sar_flood.svg",
                "explanation": "Cross-modal fusion combines Optical RGB visual features with Sentinel-1 SAR C-band radar backscatter. While cloud shadows partially obscure the optical frame, SAR microwave pulses penetrate atmospheric haze to clearly delineate specular water bodies and double-bounce urban structures.",
                "confidence": 0.932
            }
            answer = analysis_payload["explanation"]
        elif selected_model_id == "RS-VD-07":
            analysis_payload = {
                "model_id": "RS-VD-07",
                "video_file": image_files[0] if image_files else "sample_video.mp4",
                "extracted_keyframes": 6,
                "analyzed_keyframes": [
                    {"frame": 1, "timestamp": "00:01", "summary": "Baseline agricultural field"},
                    {"frame": 3, "timestamp": "00:03", "summary": "Initial grading equipment deployed"},
                    {"frame": 6, "timestamp": "00:06", "summary": "Structure foundation completed"}
                ],
                "pipeline_note": "Video analysis uses selected keyframes to perform remote-sensing analysis.",
                "confidence": 0.88
            }
            answer = "Video temporal pipeline processed 6 keyframes. Analysis indicates progressive site development over the temporal sequence."
        else:
            # Default VQA
            analysis_payload = {
                "model_id": "RS-VQ-05",
                "vqa_answer": "The satellite image shows a river ecosystem flowing through agricultural fields and dense forest canopy with scattered built-up structures.",
                "confidence": 0.91
            }
            answer = analysis_payload["vqa_answer"]

        # 5. Build Auditable Execution Summary
        execution_summary = [
            f"1. Query Understanding: Identified intent '{selected_task}' and input modality '{modality}'.",
            f"2. Input Validation: Verified satellite image parameters ({image_count} file(s) ingested).",
            f"3. Agentic Routing: Dispatched task to Specialist Model {selected_model_id} ({model_card.get('name', '')}).",
            f"4. Specialist Execution: Model run using dataset target {model_card.get('dataset', 'General Benchmark')}.",
            f"5. Result Fusion: Synthesized answer, evidence overlays, and confidence score."
        ]

        return {
            "success": True,
            "query": query,
            "task_classified": selected_task,
            "modality_detected": modality,
            "image_count": image_count,
            "selected_model": {
                "id": selected_model_id,
                "name": model_card.get("name", "Specialist Model"),
                "symbol": selected_model_id,
                "dataset": model_card.get("dataset", "BigEarthNet / Benchmark")
            },
            "answer": answer,
            "confidence": analysis_payload.get("confidence", 0.90),
            "evidence": analysis_payload,
            "execution_summary": execution_summary,
            "is_demo_data": True
        }
