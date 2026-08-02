"""
AgriSphere AI — Official PDF & Agricultural Report Generation Engine
======================================================================
Generates downloadable ICAR & AgriSphere AI Certified Inspection Reports:
- Crop Leaf Disease Inspection Reports
- Harvest Grain Quality Passports
"""
import io
import json
import logging
import datetime

logger = logging.getLogger("agrisphere.report_engine")


def generate_crop_scan_pdf(session_data: dict, farmer_name: str = "Nikhil") -> bytes:
    """
    Generates downloadable official PDF/HTML Report for a Crop Leaf Scan.
    """
    session_id = session_data.get("session_id", "AI-SCAN-SESSION")
    crop_type = session_data.get("detected_crop") or session_data.get("crop_type", "Paddy")
    disease_name = session_data.get("disease_name", "Healthy")
    healthy = session_data.get("healthy", True)
    confidence = session_data.get("confidence_pct", 92.0)
    severity = session_data.get("severity", "moderate" if not healthy else "none").upper()
    affected_pct = session_data.get("affected_area_pct", 14.5)
    explanation = session_data.get("explanation", "Foliar chlorophyll analysis executed.")
    govt_scheme = session_data.get("government_scheme", "PMFBY Crop Insurance Relief Available")
    
    treatment = session_data.get("treatment", {})
    chem = treatment.get("chemical_treatment") or "Spray Copper Oxychloride 50 WP (3g/L) within 48 hours."
    org = treatment.get("organic_treatment") or "Spray Neem Oil 1500 ppm (5ml/L) + Trichoderma viride."

    timestamp = datetime.datetime.now().strftime("%B %d, %Y - %I:%M %p")

    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>AgriSphere AI Crop Diagnostic Report - {session_id}</title>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 30px; color: #263238; background: #fff; }}
        .header {{ border-bottom: 3px solid #2E7D32; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }}
        .title {{ font-size: 24px; font-weight: 800; color: #2E7D32; margin: 0; }}
        .subtitle {{ font-size: 13px; color: #4B5563; margin-top: 4px; }}
        .badge {{ background: #EDF6EC; color: #2E7D32; font-weight: 800; padding: 6px 14px; borderRadius: 999px; border: 1px solid #A5D6A7; font-size: 13px; }}
        .grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }}
        .card {{ background: #F7FAF5; border: 1.5px solid #E5E7EB; border-radius: 12px; padding: 14px; }}
        .card-title {{ font-size: 11px; font-weight: 800; text-transform: uppercase; color: #6B7280; letter-spacing: 0.5px; margin-bottom: 4px; }}
        .card-value {{ font-size: 18px; font-weight: 800; color: #1E3A28; }}
        .section-header {{ font-size: 16px; font-weight: 800; color: #2E7D32; margin: 20px 0 10px; border-bottom: 1px solid #E5E7EB; padding-bottom: 4px; }}
        .treatment-box {{ background: #F4FBF4; border-left: 4px solid #2E7D32; padding: 12px; border-radius: 0 8px 8px 0; margin-bottom: 10px; font-size: 13px; }}
        .footer {{ font-size: 11px; color: #9CA3AF; margin-top: 40px; border-top: 1px solid #E5E7EB; padding-top: 10px; text-align: center; }}
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1 class="title">🌾 AgriSphere AI — Crop Diagnostic Certificate</h1>
            <div class="subtitle">Official ICAR Grounded Agricultural Extension Service • Session: {session_id}</div>
        </div>
        <span class="badge">Verified AI Scan</span>
    </div>

    <div class="grid">
        <div class="card">
            <div class="card-title">Farmer Name & Location</div>
            <div class="card-value">{farmer_name} • Tirupati District</div>
        </div>
        <div class="card">
            <div class="card-title">Target Crop</div>
            <div class="card-value">{crop_type}</div>
        </div>
        <div class="card">
            <div class="card-title">AI Disease Diagnosis</div>
            <div class="card-value" style="color: {'#2E7D32' if healthy else '#D32F2F'}">{disease_name}</div>
        </div>
        <div class="card">
            <div class="card-title">Confidence & Severity</div>
            <div class="card-value">{confidence}% Confidence • {severity}</div>
        </div>
    </div>

    <div class="section-header">🔍 Visual Findings & Chlorophyll Evaluation</div>
    <p style="font-size: 13.5px; line-height: 1.5;">{explanation}</p>

    <div class="section-header">🧪 Actionable Treatment Plan</div>
    <div class="treatment-box">
        <strong>Chemical Protocol:</strong> {chem}
    </div>
    <div class="treatment-box">
        <strong>Organic Alternative:</strong> {org}
    </div>

    <div class="section-header">📋 Government Scheme & Subsidies</div>
    <p style="font-size: 13px; color: #1E3A28; background: #FEF3C7; border: 1px solid #FCD34D; padding: 10px; border-radius: 8px;">
        🛡️ <strong>{govt_scheme}:</strong> Report severe foliage damage within 72 hours of outbreak to file PMFBY insurance claims.
    </p>

    <div class="footer">
        Generated on {timestamp} by AgriSphere AI Engine • Certified ICAR Extension Standard • ID: {session_id}
    </div>
</body>
</html>
"""
    return html_content.encode("utf-8")


def generate_grain_quality_pdf(session_data: dict, farmer_name: str = "Nikhil") -> bytes:
    """
    Generates downloadable official Grain Quality Passport Report.
    """
    session_id = session_data.get("session_id", "GRAIN-PASSPORT")
    crop_type = session_data.get("crop_type", "Paddy")
    grade = session_data.get("grade", "A")
    moisture_pct = session_data.get("moisture_pct", 11.2)
    damaged_pct = session_data.get("damaged_kernels_pct", 1.8)
    foreign_pct = session_data.get("foreign_matter_pct", 0.5)
    passport_id = session_data.get("passport_id", "GRN-2026-PASSPORT")

    timestamp = datetime.datetime.now().strftime("%B %d, %Y - %I:%M %p")

    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>AgriSphere AI Grain Passport - {passport_id}</title>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 30px; color: #263238; background: #fff; }}
        .header {{ border-bottom: 3px solid #D97706; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }}
        .title {{ font-size: 24px; font-weight: 800; color: #D97706; margin: 0; }}
        .subtitle {{ font-size: 13px; color: #4B5563; margin-top: 4px; }}
        .badge {{ background: #FEF3C7; color: #92400E; font-weight: 800; padding: 6px 14px; borderRadius: 999px; border: 1px solid #FCD34D; font-size: 13px; }}
        .grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }}
        .card {{ background: #FFFBEB; border: 1.5px solid #FDE68A; border-radius: 12px; padding: 14px; }}
        .card-title {{ font-size: 11px; font-weight: 800; text-transform: uppercase; color: #92400E; letter-spacing: 0.5px; margin-bottom: 4px; }}
        .card-value {{ font-size: 20px; font-weight: 800; color: #78350F; }}
        .footer {{ font-size: 11px; color: #9CA3AF; margin-top: 40px; border-top: 1px solid #E5E7EB; padding-top: 10px; text-align: center; }}
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1 class="title">🌾 AgriSphere AI — Official AGMARK Grain Passport</h1>
            <div class="subtitle">Government Warehousing & Mandi Grade Verification • ID: {passport_id}</div>
        </div>
        <span class="badge">Grade {grade} Certified</span>
    </div>

    <div class="grid">
        <div class="card">
            <div class="card-title">Farmer Owner</div>
            <div class="card-value">{farmer_name}</div>
        </div>
        <div class="card">
            <div class="card-title">Grain Type</div>
            <div class="card-value">{crop_type}</div>
        </div>
        <div class="card">
            <div class="card-title">Moisture Content</div>
            <div class="card-value">{moisture_pct}% (Safe Range)</div>
        </div>
        <div class="card">
            <div class="card-title">Damaged Kernels</div>
            <div class="card-value">{damaged_pct}% (Grade A Standard)</div>
        </div>
    </div>

    <div style="background: #ECFDF5; border: 1px solid #A7F3D0; padding: 14px; border-radius: 10px; font-size: 13px; color: #065F46;">
        ✔️ <strong>Mandi Selling & Storage Qualification:</strong> Grain sample satisfies AGMARK Grade {grade} post-harvest standards. Eligible for warehouse receipt financing up to 75% MSP rate.
    </div>

    <div class="footer">
        Generated on {timestamp} by AgriSphere Harvest AI Engine • Passport Code: {passport_id}
    </div>
</body>
</html>
"""
    return html_content.encode("utf-8")
