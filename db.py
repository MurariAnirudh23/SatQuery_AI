"""
Database models and SQLite connection module for SatQuery AI.
Supports ORM entities for Analysis Logs, Monitoring AOIs, Alerts, Rockets, Reports, and Quiz Attempts.
"""
import json
import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "data", "db.sqlite")

def get_db_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Analysis Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS analysis_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        query TEXT,
        task_type TEXT,
        modality TEXT,
        images_count INTEGER,
        result_summary TEXT,
        confidence REAL,
        execution_summary TEXT,
        is_demo INTEGER
    )
    """)
    
    # Monitoring AOIs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS monitoring_aois (
        id TEXT PRIMARY KEY,
        name TEXT,
        location_name TEXT,
        coordinates_json TEXT,
        sensor_type TEXT,
        change_threshold REAL,
        alert_enabled INTEGER,
        last_checked TEXT,
        last_change_pct REAL,
        status TEXT
    )
    """)
    
    # Alerts Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        aoi_id TEXT,
        aoi_name TEXT,
        timestamp TEXT,
        change_pct REAL,
        threshold REAL,
        change_type TEXT,
        confidence REAL,
        status TEXT
    )
    """)
    
    # Rocket Tracking Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS rockets (
        id TEXT PRIMARY KEY,
        rocket_name TEXT,
        max_speed_kmh REAL,
        contact_info TEXT,
        status TEXT,
        launch_site TEXT,
        payload_type TEXT,
        created_at TEXT
    )
    """)

    # Seed Default Rockets if empty
    cursor.execute("SELECT COUNT(*) FROM rockets")
    if cursor.fetchone()[0] == 0:
        default_rockets = [
            ("ROCKET-PSLV-C56", "PSLV-C56 (ISRO)", 27000.0, "telemetry@isro.gov.in", "Active Tracking", "Sriharikota SDSC", "Commercial Satellite", datetime.now().isoformat()),
            ("ROCKET-F9-B1080", "Falcon 9 Block 5", 28000.0, "launch-ops@spacex.com", "Orbit Verified", "SLC-40 Cape Canaveral", "Earth Observation Payload", datetime.now().isoformat()),
            ("ROCKET-ARIANE-6", "Ariane 62 (ESA)", 26500.0, "flight-control@arianespace.com", "Pre-Launch Prep", "Kourou CSG French Guiana", "Sentinel Cop-3 Payload", datetime.now().isoformat())
        ]
        cursor.executemany("INSERT INTO rockets VALUES (?,?,?,?,?,?,?,?)", default_rockets)

    # Quiz Attempts Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quiz_attempts (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        score INTEGER,
        total INTEGER,
        percentage REAL
    )
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at", DB_PATH)
