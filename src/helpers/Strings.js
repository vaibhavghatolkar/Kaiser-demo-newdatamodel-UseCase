import { Inbound_Encounter_ClaimDetails837 } from "../app/containers/InboundEncounter/Inbound_Encounter_Claim_Details_837";

const Strings = {
    CLAIMS : 'claimsManagement',
    REALTIME_837_CLAIM: 'REALTIME_837_CLAIM',
    REALTIME276 : 'real_time_276',
    REALTIME270 : 'real_time_270',
    EDIT_CLAIM : 'editClaim',
    TRAN_MANAGMENT : 'tranMng',
    FULL_FILE : 'full_file',
    TRAD_MANAGEMENT : 'tradMng',
    ENR_MANAGEMENT : 'enrMng',
    PROC_MANAGEMENT : 'procMng',
    REP_MANAGEMENT : 'repMng',
    ACK_MANAGEMENT : 'ackMng',

    claimsDashboard: 'claimsDashboard',
    tradingPartnerDetails : 'tradingPartnerDetails',
    tradingPartnerConfiguration : 'tradingPartnerConfiguration',
    claimsDashboard_835 : 'claimsDashboard_835',
    claimsDashboard_834 : 'claimsDashboard_834',
    claimsDashboard_834_details : 'claimsDashboard_834_details',
    editConfiguration : 'editConfiguration',
    RealTime276 : 'realTime276',
    RealTime270 : 'realTime270',
    submitClaims : 'submitClaims',
    claimDetails : 'claimDetails',
    claimsAudit : 'claimsAudit',
    claimsError : 'claimsError',
    matchClaims : 'matchClaims',
    outbound_matchClaims : 'outbound_matchClaims',
    researchQueue : 'researchQueue',
    viewEdit : 'viewEdit',
    validation : 'validation',
    fullFile834 : 'fullFile834',
    files_834 : 'files_834',
    transactionSetup : 'transactionSetup',
    companionGuide : 'companionGuide',
    covered : 'covered',
    noncovered : 'noncovered',
    AuditSummary270: 'AuditSummary270',
    ErrorDetails276: 'ErrorDetails276',
    ElilgibilityDetails270: 'elilgibilityDetails270',
    ElilgibilityDetails276: 'claimStatusDetails276',
    elilgibilityErrors270: 'elilgibilityErrors270',
    elilgibilityErrors276: 'elilgibilityErrors276',
    ViewCustomEdits: 'viewCustomEdits',
    UserManagement:'UserManagement',
    UserList:'userList',
    MenuCreate:'userRoleManagement',
    ChangePassword:'changePassword',
    EnrollmentError : 'Enrollment_Error', 
    EnrollmentDetails: 'EnrollmentDetails',
    EnrollmentErrors: 'EnrollmentErrors',
    Outbound_dashboard:'Outbound_dashboard',
    Eligibility_Reconcile_Search:'Eligibility_Reconcile_Search',
    Eligibility_Errors:'Eligibility_Errors',
    EligibilityErrorsDelta :'EligibilityErrorsDelta',
    HistoryEligibilityErrorsDelta: 'HistoryEligibilityErrorsDelta',
    RateCodeDelta: 'RateCodeDelta',
    PlanIntegrationEligibilityErrors: 'PlanIntegrationEligibilityErrors',
    HistoryRateCodeDelta: 'HistoryRateCodeDelta',
    MedicalMonthly_Metrics:'MedicalMonthly_Metrics',
    CustomDBDetails: 'CustomDBDetails',
    EligibilityErrorsDuplicate: 'EligibilityErrorsDuplicate',
    OutboundDetails: 'OutboundDetails',
    FullComparsion_dashboard: 'FullComparsion_dashboard',
    ClaimDetails837: 'ClaimDetails837',
    RealTimeDashboard: 'claimsDashboard',
    ClaimProcessingSummary: 'claimProcessingSummary',
    _277CAResponse: '_277CAResponse',
    Outbound_277CAResponse: 'Outbound_277CAResponse',
    // ClaimProcessingSummary: 'claimsAudit',
    Files_837 : 'Files_837',
    MenuManagement: 'MenuManagement',
    TradingPartner:'TradingPartner',
    EncounterDashboard:'EncounterDashboard',
    EncounterDetails:'EncounterDetails',
    claimPayment_835: 'claimPaymentDashboard835',
    healthCare278: 'healthCare278Dashboard',
    serviceDetails278: 'serviceDetails278',
    response_999:'response_999',
    Outbound_ClaimProcessingSummary: 'Outbound_ClaimProcessingSummary',
    Outbound_RealTimeDashboard:'Outbound_RealTimeDashboard',
    Outbound_ClaimDetails837:'Outbound_ClaimDetails837',
    Outbound_ClaimsError: 'Outbound_ClaimsError',
    Inbound_Encounter_Audit:'Inbound_Encounter_Audit',
    Outbound_AuditSummary: 'Outbound_AuditSummary',
    Outbound_response_999: 'Outbound_response_999',
    Inbound_EncounterDashboard : 'Inbound_EncounterDashboard',
    Inbound_EncounterDetails : 'Inbound_EncounterDetails',
    Inbound_Encounter_ClaimProcessingSummary : 'Inbound_Encounter_ClaimProcessingSummary',
    Outbound_Encounter_RealTimeDashboard:'Outbound_Encounter_RealTimeDashboard',
    Outbound_Encounter_ClaimDetails837: 'Outbound_Encounter_ClaimDetails837',
    Outbound_Encounter_Audit:'Outbound_Encounter_Audit',
    Outbound_Encounter_ClaimProcessingSummary:'Outbound_Encounter_ClaimProcessingSummary',
    Outbound_TradingPartnerConfiguration:'Outbound_TradingPartnerConfiguration',

    Outbound_TransactionSetup : 'Outbound_TransactionSetup',
    Outbound_EditConfigurations:'Outbound_EditConfigurations',
    Outbound_View_customEdit:'Outbound_View_customEdit',
    Outbound_Covered:'Outbound_Covered',
    Outbound_NonCovered:'Outbound_NonCovered',
    Outbound_CompanionGuide:'Outbound_CompanionGuide',
    Outbound_StatewiseTradingPartner:'Outbound_StatewiseTradingPartner',
    NPILook_Up:'NPILook_Up',
    Outbound_NPILook_Up:'Outbound_NPILook_Up',
    Outbound_View_customEditNew: 'Outbound_View_customEditNew',
    View_CustomEditsNew: 'View_CustomEditsNew',
    Outbound_BatchDetails837: 'Outbound_BatchDetails837',
    Outbound_Encounter_BatchDetails837: 'Outbound_Encounter_BatchDetails837',
    _277_Reponse : `ISA*00*00*ZZ*ENH3706*ZZ*80882*190915*1156*:*00501*000006612*1*P*>~GS*439*ENH3706*80882*20190915*1156*1302*X*005010X222A1~ST*277*0001*005010X214~BHT*0019*00*3093*20190915*1156*CH~HL*1*20*1~NM1*PR*2*GH GENERATIONS*****46*95202~TRN*1*201106240006~DTP*050*D8*20110223~HL*2*5*PT~NM1*IL*1*JONES*JUDITH*N***MI*3WK9WA2MD58~TRN*2*7702284~STC*A2:20*20191016*WQ*392~REF*1K*22559~REF*D9*555510201390671~REF*BLT*131~DTP*472*RD8*20191018-20191018~HL*3*5*PT~NM1*IL*1*BEVENUE*BILLY*N***MI*6UP0JV8HY20~TRN*2*7695779~STC*A2:20*20191016*WQ*161~REF*1K*22559~REF*D9*555510201390671~REF*BLT*131~DTP*472*RD8*20191018-20191018~HL*4*5*PT~NM1*IL*1*HYAMS*PATRICIA*N***MI*2A85WN6KP70~TRN*2*7695782~STC*A2:20*20191016*WQ*161~REF*1K*22559~REF*D9*555510201390671~REF*BLT*131~DTP*472*RD8*20191018-...`
}

export default Strings;
