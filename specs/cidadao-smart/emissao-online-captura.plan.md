# Emissao Online Captura - Draft Plan

## Feature Summary

Flow to upload photo in Emissao Online and proceed safely to next stage.

## Scope

- /emitir/captura
- Upload via file chooser
- Adjust photo and accept
- Validate success preview
- Validate prosseguir enabled

## Out of Scope

- Real camera capture
- Final emission confirmation

## Preconditions

- VPN connected
- CIDADAO_SMART_BASE_URL configured
- tests/support/files/valid-photo.jpg available

## Risks

- Missing data-testid for upload controls
- Modal texts can vary across environments

## Acceptance Criteria

- User can upload valid photo
- User sees success preview
- Prosseguir becomes enabled

## Suggested Spec

- tests/cidadao-smart-emissao-online-captura.spec.ts

## Suggested Pages

- tests/pages/CidadaoSmartEmissaoCapturaPage.ts
- tests/pages/selectors/CidadaoSmartEmissaoCapturaPageSelectors.ts
