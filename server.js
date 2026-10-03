/**
 * SatQuery AI — Full Stack Node.js Server
 * Host: http://localhost:3000
 * Serves FastAPI-equivalent REST endpoints (/api/*) + Single-Page React Geospatial Application
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// In-Memory & File Storage
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db_store.json');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

let db = {
    aois: [
        {
            id: 'AOI-AMAZON-01',
            name: 'Amazon Rainforest Sector A',
            location_name: 'Manaus, Brazil (-3.4653°, -62.2159°)',
            coordinates_json: '[[ -62.25, -3.45 ], [ -62.18, -3.45 ], [ -62.18, -3.50 ], [ -62.25, -3.50 ]]',
            sensor_type: 'Sentinel-2 Optical + Sentinel-1 SAR',
            change_threshold: 35.0,
            alert_enabled: 1,
            last_checked: new Date().toISOString(),
            last_change_pct: 38.4,
            status: 'Active Watch'
        },
        {
            id: 'AOI-URBAN-02',
            name: 'Hyderabad Urban Expansion Watch',
            location_name: 'Hyderabad, India (17.3850°, 78.4867°)',
            coordinates_json: '[[ 78.45, 17.40 ], [ 78.50, 17.40 ], [ 78.50, 17.36 ], [ 78.45, 17.36 ]]',
            sensor_type: 'Multispectral',
            change_threshold: 25.0,
            alert_enabled: 1,
            last_checked: new Date().toISOString(),
            last_change_pct: 22.1,
            status: 'Active Watch'
        }
    ],
    alerts: [
        {
            id: 'ALT-8921A',
            aoi_id: 'AOI-AMAZON-01',
            aoi_name: 'Amazon Rainforest Sector A',
            timestamp: new Date().toISOString(),
            change_pct: 38.4,
            threshold: 35.0,
            change_type: 'Vegetation Conversion to Urban Structure',
            confidence: 0.912,
            status: 'TRIGGERED'
        }
    ],
    rockets: [
        {
            id: 'ROCKET-PSLV-C56',
            rocket_name: 'PSLV-C56 (ISRO)',
            max_speed_kmh: 27000.0,
            contact_info: 'telemetry@isro.gov.in',
            status: 'Active Tracking',
            launch_site: 'Sriharikota SDSC',
            payload_type: 'Commercial Earth Observation Satellite',
            created_at: new Date().toISOString()
        },
        {
            id: 'ROCKET-F9-B1080',
            rocket_name: 'Falcon 9 Block 5 (SpaceX)',
            max_speed_kmh: 28000.0,
            contact_info: 'launch-ops@spacex.com',
            status: 'Orbit Verified',
            launch_site: 'SLC-40 Cape Canaveral',
            payload_type: 'High-Res SAR Radar Payload',
            created_at: new Date().toISOString()
        },
        {
            id: 'ROCKET-ARIANE-6',
            rocket_name: 'Ariane 62 (ESA)',
            max_speed_kmh: 26500.0,
            contact_info: 'flight-control@arianespace.com',
            status: 'Pre-Launch Prep',
            launch_site: 'Kourou CSG French Guiana',
            payload_type: 'Sentinel Cop-3 Multispectral',
            created_at: new Date().toISOString()
        }
    ]
};

if (fs.existsSync(DB_FILE)) {
    try {
        db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
        console.error("Error reading database store, using initial state:", e);
    }
}

function saveDb() {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

// MIME Types Map
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // --- API ROUTES ---

    // Health Check
    if (pathname === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'online',
            app: 'Semantic Retrieval AI',
            tagline: 'Ask. Analyze. Understand.',
            timestamp: new Date().toISOString()
        }));
        return;
    }

    // Agentic Query Endpoint
    if (pathname === '/api/analysis/query' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            let payload = {};
            try { payload = JSON.parse(body || '{}'); } catch(e){}
            const queryText = payload.query || 'Analyze satellite image';
            const qLower = queryText.toLowerCase();

            // Task Classification & BigEarthNet Fine-Tuned Routing Logic
            let task = "Visual Question Answering (RS-VQ-05)";
            let modelId = "RS-LC-01-BigEarthNet";
            let answer = "BigEarthNet-19 fine-tuned analysis shows 41.2% Arable Agricultural land, 32.5% Broad-leaved forest canopy, 15.1% Urban built-up fabric, and 7.4% Surface water.";
            let evidenceData = {
                fine_tuning_status: "BigEarthNet-19 Fine-Tuned Weights Loaded",
                land_cover_percentages: { "Arable land": 41.2, "Forest": 32.5, "Built-up": 15.1, "Water": 7.4, "Other": 3.8 },
                dominant_class: "Arable land (Agricultural)",
                confidence: 0.942,
                legend: [
                    { class: "Arable land", color: "#f59e0b", pct: 41.2 },
                    { class: "Forest", color: "#10b981", pct: 32.5 },
                    { class: "Built-up", color: "#94a3b8", pct: 15.1 },
                    { class: "Water", color: "#38bdf8", pct: 7.4 },
                    { class: "Other", color: "#64748b", pct: 3.8 }
                ]
            };

            if (qLower.includes("change") || qLower.includes("compare") || qLower.includes("temporal") || qLower.includes("before")) {
                task = "Bi-Temporal Change Detection (RS-CD-02)";
                modelId = "RS-CD-02-Siamese";
                answer = "Bi-temporal analysis (Observation T1 vs Observation T2) indicates a significant 38.4% land-use conversion. Dense forest canopy was converted into industrial built-up foundations and road networks.";
                evidenceData = {
                    change_detected: true,
                    change_percentage: 38.4,
                    change_type: "Vegetation Conversion to Built-up Infrastructure",
                    before_period: "Observation T1",
                    after_period: "Observation T2",
                    change_mask_url: "/samples/change_mask.svg",
                    confidence: 0.924
                };
            } else if (qLower.includes("object") || qLower.includes("building") || qLower.includes("detect") || qLower.includes("car")) {
                task = "Geospatial Object Detection (RS-OD-03)";
                modelId = "RS-OD-03-YOLO-RS";
                answer = "Detected 13 remote-sensing objects: 6 Industrial Buildings (94% conf), 1 Surface Water Reservoir (98% conf), and 4 Agricultural Structures.";
                evidenceData = {
                    detected_objects: [
                        { label: "Industrial Building", count: 6, confidence: 0.94 },
                        { label: "Water Reservoir", count: 1, confidence: 0.98 },
                        { label: "Agricultural Structure", count: 4, confidence: 0.87 }
                    ],
                    total_count: 13,
                    confidence: 0.935
                };
            } else if (qLower.includes("ndvi") || qLower.includes("index") || qLower.includes("water") || qLower.includes("ndwi")) {
                task = "Radiometric Spectral Index Analysis (RS-IX-04)";
                modelId = "RS-IX-04-Radiometric";
                answer = "Calculated NDVI vegetation index. Mean raster score +0.54 indicates healthy dense canopy chlorophyll content.";
                evidenceData = {
                    index_type: "NDVI",
                    formula: "(NIR - RED) / (NIR + RED)",
                    mean_value: 0.54,
                    raster_url: "/samples/ndvi_raster.svg",
                    confidence: 0.98
                };
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                query: queryText,
                task_classified: task,
                modality_detected: qLower.includes("sar") ? "C-Band SAR Radar" : "Sentinel-2 Optical RGB",
                selected_model: {
                    id: modelId,
                    name: task,
                    dataset: "BigEarthNet-19 / OSCD Earth Observation Adapter"
                },
                answer: answer,
                confidence: evidenceData.confidence || 0.942,
                evidence: evidenceData,
                execution_summary: [
                    "1. Ingested user uploaded satellite image file (PNG/JPG/JPEG).",
                    "2. Loaded BigEarthNet-19 fine-tuned weights & validated band resolution.",
                    "3. Dispatched image to Specialist Model adapter " + modelId + ".",
                    "4. Calculated spatial metrics & synthesized visual evidence overlay."
                ],
                is_demo_data: true
            }));
        });
        return;
    }

    // AOIs GET / POST
    if (pathname === '/api/monitoring/aois') {
        if (method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(db.aois));
            return;
        }
        if (method === 'POST') {
            let body = '';
            req.on('data', c => body += c);
            req.on('end', () => {
                const data = JSON.parse(body || '{}');
                const newAoi = {
                    id: 'AOI-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
                    name: data.name || 'New AOI Watch',
                    location_name: data.location_name || 'Selected Region',
                    coordinates_json: data.coordinates_json || '[]',
                    sensor_type: data.sensor_type || 'Optical',
                    change_threshold: data.change_threshold || 35.0,
                    alert_enabled: 1,
                    last_checked: new Date().toISOString(),
                    last_change_pct: 38.4,
                    status: 'Active Watch'
                };
                db.aois.unshift(newAoi);

                if (38.4 >= newAoi.change_threshold) {
                    db.alerts.unshift({
                        id: 'ALT-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
                        aoi_id: newAoi.id,
                        aoi_name: newAoi.name,
                        timestamp: new Date().toISOString(),
                        change_pct: 38.4,
                        threshold: newAoi.change_threshold,
                        change_type: 'Structural Modification Detected',
                        confidence: 0.912,
                        status: 'TRIGGERED'
                    });
                }
                saveDb();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, aoi: newAoi }));
            });
            return;
        }
    }

    // ALERTS GET
    if (pathname === '/api/monitoring/alerts' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(db.alerts));
        return;
    }

    // ROCKETS GET / POST
    if (pathname === '/api/rockets') {
        if (method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(db.rockets));
            return;
        }
        if (method === 'POST') {
            let body = '';
            req.on('data', c => body += c);
            req.on('end', () => {
                const data = JSON.parse(body || '{}');
                const newRocket = {
                    id: 'ROCKET-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
                    rocket_name: data.rocket_name || 'Custom Rocket',
                    max_speed_kmh: Number(data.max_speed_kmh) || 25000,
                    contact_info: data.contact_info || 'contact@agency.gov',
                    status: data.status || 'Active Tracking',
                    launch_site: data.launch_site || 'Spaceport',
                    payload_type: data.payload_type || 'Earth Observation',
                    created_at: new Date().toISOString()
                };
                db.rockets.unshift(newRocket);
                saveDb();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, rocket: newRocket }));
            });
            return;
        }
    }

    // PROMPT EVALUATOR
    if (pathname === '/api/learning/prompt-evaluator' && method === 'POST') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            const data = JSON.parse(body || '{}');
            const prompt = (data.prompt || '').trim();
            let score = 50;
            const feedback = [];

            if (prompt.length < 15) {
                score -= 20;
                feedback.push("Prompt is too short. Add target features or spatial context.");
            } else {
                score += 15;
                feedback.push("Good query length.");
            }

            if (/identify|detect|calculate|compare|classify|estimate/i.test(prompt)) {
                score += 15;
                feedback.push("Contains clear geospatial action verb.");
            }
            if (/land cover|forest|water|urban|built-up|crop|ndvi/i.test(prompt)) {
                score += 15;
                feedback.push("Target satellite features specified.");
            }
            score = Math.min(100, Math.max(10, score));

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                prompt,
                score_percentage: score,
                rating_label: score >= 80 ? "Excellent Prompt" : (score >= 60 ? "Better Prompt" : "Weak Prompt"),
                feedback_points: feedback,
                improved_suggestion: `Identify the major land-cover types and estimate spatial distribution: '${prompt}'`
            }));
        });
        return;
    }

    // --- STATIC FILES / FRONTEND SERVING ---
    let filePath = path.join(__dirname, 'frontend', 'public', pathname);

    // Default to index.html for SPA routes
    if (pathname === '/' || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(__dirname, 'frontend', 'public', 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end("404 Not Found");
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 SEMANTIC RETRIEVAL AI FULL-STACK SERVER ONLINE`);
    console.log(`   "Ask. Analyze. Understand."`);
    console.log(`--------------------------------------------------`);
    console.log(`🌐 Application URL: http://localhost:${PORT}`);
    console.log(`📡 API Health:      http://localhost:${PORT}/api/health`);
    console.log(`==================================================\n`);
});
