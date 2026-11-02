# SICR ML Matching Module

## Purpose
Standalone Machine Learning module for recommending suitable investors for startup ideas.

## Main API
POST /api/recommend-investors

## Start API
python sicr_ml_api.py

## API URL
http://127.0.0.1:5001

## Input
- idea
- stage
- required_funding
- location
- top_n

## Output
Ranked investor recommendations with ML match scores.

## Main Components
- Flask API
- Investor domain detection
- Semantic similarity using all-MiniLM-L6-v2
- Random Forest matching model
- 10,000 investor profiles

## Integration
The main SICR backend can call this API and use the returned investor recommendations for the investor profile, connection, contact and chat features.

## Important
The ML module handles recommendation/matching only. The main SICR ecosystem handles users, authentication, connections, chat and frontend.
