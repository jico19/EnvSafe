# Implementation Plan: Centralize Tier Configuration

## Step 1: Create Constants Module
- [x] Create
 `backend/apps/core/constants.py`.
- [x] 
 Define `TierChoices` and `EnvChoices` (moved from `models.py`).
- [x] 
 Define `TIER_CONFIG`.

## Step 2: Update Models
- [x] 
 In `backend/apps/core/models.py`, import `TierChoices` and `EnvChoices` from `.constants`.
- [x] 
 Remove local definitions of `TierChoices` and `EnvChoices`.

## Step 3: Update ViewSets
- [x] 
 In `backend/apps/core/viewsets.py`, import `TIER_CONFIG` from `.constants`.
- [x] 
 Update `ProjectViewSets.perform_create` to lookup limits from `TIER_CONFIG`.
- [x] 
 Update `ProjectViewSets.perform_update` to lookup limits from `TIER_CONFIG`.
- [x] 
 Update `ProjectMemberViewSets.create` to lookup limits from `TIER_CONFIG`.

## Step 4: Verification
- [x] 
 Run existing tests: `python backend/manage.py test apps.core.tests`.
- [x] Create
 and run new tests: `python backend/manage.py test apps.core.test_tier_limits`.
- [x] 
 Verify manual creation of projects/members respects the new config.
