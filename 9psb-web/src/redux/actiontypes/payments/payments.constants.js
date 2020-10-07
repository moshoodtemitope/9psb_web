export const paymentsConstants ={

    TRANSFER_TO_PHONE_STEP1_SUCCESS : 'TRANSFER_TO_PHONE_STEP1_SUCCESS',
    TRANSFER_TO_PHONE_STEP1_PENDING : 'TRANSFER_TO_PHONE_STEP1_PENDING',
    TRANSFER_TO_PHONE_STEP1_FAILURE : 'TRANSFER_TO_PHONE_STEP1_FAILURE',
    TRANSFER_TO_PHONE_STEP1_RESET : 'TRANSFER_TO_PHONE_STEP1_RESET',

    TRANSFER_TO_PHONE_NUMBER_SUCCESS : 'TRANSFER_TO_PHONE_NUMBER_SUCCESS',
    TRANSFER_TO_PHONE_NUMBER_PENDING : 'TRANSFER_TO_PHONE_NUMBER_PENDING',
    TRANSFER_TO_PHONE_NUMBER_FAILURE : 'TRANSFER_TO_PHONE_NUMBER_FAILURE',
    TRANSFER_TO_PHONE_NUMBER_RESET : 'TRANSFER_TO_PHONE_NUMBER_RESET',

    GET_TRANSFER_BENEFICIARIES_SUCCESS : 'GET_TRANSFER_BENEFICIARIES_SUCCESS',
    GET_TRANSFER_BENEFICIARIES_PENDING : 'GET_TRANSFER_BENEFICIARIES_PENDING',
    GET_TRANSFER_BENEFICIARIES_FAILURE : 'GET_TRANSFER_BENEFICIARIES_FAILURE',

    GET_BANKS_SUCCESS : 'GET_BANKS_SUCCESS',
    GET_BANKS_PENDING : 'GET_BANKS_PENDING',
    GET_BANKS_FAILURE : 'GET_BANKS_FAILURE',

    CONFIRM_ACCOUNT_PENDING : 'CONFIRM_ACCOUNT_PENDING',
    CONFIRM_ACCOUNT_FAILURE : 'CONFIRM_ACCOUNT_FAILURE',
    STORE_BENEFICIARY_DATA : 'STORE_BENEFICIARY_DATA',
    CLEAR_STORED_BENEFICIARY_DATA : 'CLEAR_STORED_BENEFICIARY_DATA',

    TRANSFER_TO_BANK_SUCCESS : 'TRANSFER_TO_BANK_SUCCESS',
    TRANSFER_TO_BANK_PENDING : 'TRANSFER_TO_BANK_PENDING',
    TRANSFER_TO_BANK_FAILURE : 'TRANSFER_TO_BANK_FAILURE',
    TRANSFER_TO_BANK_RESET : 'TRANSFER_TO_BANK_RESET',


    STORE_RECIPIENT_DATA : 'STORE_RECIPIENT_DATA',
    CLEAR_STORED_RECIPIENT_DATA : 'CLEAR_STORED_RECIPIENT_DATA',


    //CASH WITHDRAWAL 
    CARDLESS_WITHDRAWAL_STEP1_SUCCESS : 'CARDLESS_WITHDRAWAL_STEP1_SUCCESS',
    CARDLESS_WITHDRAWAL_STEP1_PENDING : 'CARDLESS_WITHDRAWAL_STEP1_PENDING',
    CARDLESS_WITHDRAWAL_STEP1_FAILURE : 'CARDLESS_WITHDRAWAL_STEP1_FAILURE',
    CARDLESS_WITHDRAWAL_STEP1_RESET : 'CARDLESS_WITHDRAWAL_STEP1_RESET',
    
    CARDLESS_WITHDRAWAL_STEP2_SUCCESS : 'CARDLESS_WITHDRAWAL_STEP2_SUCCESS',
    CARDLESS_WITHDRAWAL_STEP2_PENDING : 'CARDLESS_WITHDRAWAL_STEP2_PENDING',
    CARDLESS_WITHDRAWAL_STEP2_FAILURE : 'CARDLESS_WITHDRAWAL_STEP2_FAILURE',
    CARDLESS_WITHDRAWAL_STEP2_RESET : 'CARDLESS_WITHDRAWAL_STEP2_RESET',

    AGENT_WITHDRAWAL_STEP1_SUCCESS : 'AGENT_WITHDRAWAL_STEP1_SUCCESS',
    AGENT_WITHDRAWAL_STEP1_PENDING : 'AGENT_WITHDRAWAL_STEP1_PENDING',
    AGENT_WITHDRAWAL_STEP1_FAILURE : 'AGENT_WITHDRAWAL_STEP1_FAILURE',
    AGENT_WITHDRAWAL_STEP1_RESET : 'AGENT_WITHDRAWAL_STEP1_RESET',

    AGENT_WITHDRAWAL_STEP2_SUCCESS : 'AGENT_WITHDRAWAL_STEP2_SUCCESS',
    AGENT_WITHDRAWAL_STEP2_PENDING : 'AGENT_WITHDRAWAL_STEP2_PENDING',
    AGENT_WITHDRAWAL_STEP2_FAILURE : 'AGENT_WITHDRAWAL_STEP2_FAILURE',
    AGENT_WITHDRAWAL_STEP2_RESET : 'AGENT_WITHDRAWAL_STEP2_RESET',

    GET_AGENTS_SUCCESS : 'GET_AGENTS_SUCCESS',
    GET_AGENTS_PENDING : 'GET_AGENTS_PENDING',
    GET_AGENTS_FAILURE : 'GET_AGENTS_FAILURE',
    GET_AGENTS_RESET : 'GET_AGENTS_RESET',


    // DATA TOP UP
    BUY_DATATOPUP_SUCCESS : 'BUY_DATATOPUP_SUCCESS',
    BUY_DATATOPUP_PENDING : 'BUY_DATATOPUP_PENDING',
    BUY_DATATOPUP_FAILURE : 'BUY_DATATOPUP_FAILURE',
    BUY_DATATOPUP_RESET : 'BUY_DATATOPUP_RESET',

    SAVE_DATATOPUP_BENEFICIARY_SUCCESS : 'SAVE_DATATOPUP_BENEFICIARY_SUCCESS',
    SAVE_DATATOPUP_BENEFICIARY_PENDING : 'SAVE_DATATOPUP_BENEFICIARY_PENDING',
    SAVE_DATATOPUP_BENEFICIARY_FAILURE : 'SAVE_DATATOPUP_BENEFICIARY_FAILURE',
    SAVE_DATATOPUP_BENEFICIARY_RESET : 'SAVE_DATATOPUP_BENEFICIARY_RESET',

    FETCH_DATATOPUP_BENEFICIARIES_SUCCESS : 'FETCH_DATATOPUP_BENEFICIARIES_SUCCESS',
    FETCH_DATATOPUP_BENEFICIARIES_PENDING : 'FETCH_DATATOPUP_BENEFICIARIES_PENDING',
    FETCH_DATATOPUP_BENEFICIARIES_FAILURE : 'FETCH_DATATOPUP_BENEFICIARIES_FAILURE',
    FETCH_DATATOPUP_BENEFICIARIES_RESET : 'FETCH_DATATOPUP_BENEFICIARIES_RESET',

    FETCH_DATATOPUP_PLANS_SUCCESS : 'FETCH_DATATOPUP_PLANS_SUCCESS',
    FETCH_DATATOPUP_PLANS_PENDING : 'FETCH_DATATOPUP_PLANS_PENDING',
    FETCH_DATATOPUP_PLANS_FAILURE : 'FETCH_DATATOPUP_PLANS_FAILURE',
    FETCH_DATATOPUP_PLANS_RESET : 'FETCH_DATATOPUP_PLANS_RESET',

    DELETE_DATATOPUP_BENEFICIARY_SUCCESS : 'DELETE_DATATOPUP_BENEFICIARY_SUCCESS',
    DELETE_DATATOPUP_BENEFICIARY_PENDING : 'DELETE_DATATOPUP_BENEFICIARY_PENDING',
    DELETE_DATATOPUP_BENEFICIARY_FAILURE : 'DELETE_DATATOPUP_BENEFICIARY_FAILURE',
    DELETE_DATATOPUP_BENEFICIARY_RESET : 'DELETE_DATATOPUP_BENEFICIARY_RESET',


    STORE_DATATOPUP_RECIPIENT_DATA : 'STORE_DATATOPUP_RECIPIENT_DATA',
    CLEAR_STORED_DATATOPUP_RECIPIENT_DATA : 'CLEAR_STORED_DATATOPUP_RECIPIENT_DATA',


    // AIRTIME TOP UP 
    BUY_AIRTIME_SUCCESS : 'BUY_AIRTIME_SUCCESS',
    BUY_AIRTIME_PENDING : 'BUY_AIRTIME_PENDING',
    BUY_AIRTIME_FAILURE : 'BUY_AIRTIME_FAILURE',
    BUY_AIRTIME_RESET : 'BUY_AIRTIME_RESET',

    SAVE_AIRTIME_BENEFICIARY_SUCCESS : 'SAVE_AIRTIME_BENEFICIARY_SUCCESS',
    SAVE_AIRTIME_BENEFICIARY_PENDING : 'SAVE_AIRTIME_BENEFICIARY_PENDING',
    SAVE_AIRTIME_BENEFICIARY_FAILURE : 'SAVE_AIRTIME_BENEFICIARY_FAILURE',
    SAVE_AIRTIME_BENEFICIARY_RESET : 'SAVE_AIRTIME_BENEFICIARY_RESET',

    FETCH_AIRTIME_BENEFICIARIES_SUCCESS : 'FETCH_AIRTIME_BENEFICIARIES_SUCCESS',
    FETCH_AIRTIME_BENEFICIARIES_PENDING : 'FETCH_AIRTIME_BENEFICIARIES_PENDING',
    FETCH_AIRTIME_BENEFICIARIES_FAILURE : 'FETCH_AIRTIME_BENEFICIARIES_FAILURE',
    FETCH_AIRTIME_BENEFICIARIES_RESET : 'FETCH_AIRTIME_BENEFICIARIES_RESET',

    DELETE_AIRTIME_BENEFICIARY_SUCCESS : 'DELETE_AIRTIME_BENEFICIARY_SUCCESS',
    DELETE_AIRTIME_BENEFICIARY_PENDING : 'DELETE_AIRTIME_BENEFICIARY_PENDING',
    DELETE_AIRTIME_BENEFICIARY_FAILURE : 'DELETE_AIRTIME_BENEFICIARY_FAILURE',
    DELETE_AIRTIME_BENEFICIARY_RESET : 'DELETE_AIRTIME_BENEFICIARY_RESET',

    STORE_AIRTIME_RECIPIENT_DATA : 'STORE_AIRTIME_RECIPIENT_DATA',
    CLEAR_STORED_AIRTIME_RECIPIENT_DATA : 'CLEAR_STORED_AIRTIME_RECIPIENT_DATA',



    //BILLS PAYMENT
    GET_BILLS_CATEGORIES_SUCCESS : 'GET_BILLS_CATEGORIES_SUCCESS',
    GET_BILLS_CATEGORIES_PENDING : 'GET_BILLS_CATEGORIES_PENDING',
    GET_BILLS_CATEGORIES_FAILURE : 'GET_BILLS_CATEGORIES_FAILURE',
    GET_BILLS_CATEGORIES_RESET : 'GET_BILLS_CATEGORIES_RESET',

    GET_BILLERS_BY_CATEGORY_SUCCESS : 'GET_BILLERS_BY_CATEGORY_SUCCESS',
    GET_BILLERS_BY_CATEGORY_PENDING : 'GET_BILLERS_BY_CATEGORY_PENDING',
    GET_BILLERS_BY_CATEGORY_FAILURE : 'GET_BILLERS_BY_CATEGORY_FAILURE',
    GET_BILLERS_BY_CATEGORY_RESET : 'GET_BILLERS_BY_CATEGORY_RESET',

    GET_ALLBILLER_PAYMENT_ITEM_SUCCESS : 'GET_ALLBILLER_PAYMENT_ITEM_SUCCESS',
    GET_ALLBILLER_PAYMENT_ITEM_PENDING : 'GET_ALLBILLER_PAYMENT_ITEM_PENDING',
    GET_ALLBILLER_PAYMENT_ITEM_FAILURE : 'GET_ALLBILLER_PAYMENT_ITEM_FAILURE',
    GET_ALLBILLER_PAYMENT_ITEM_RESET : 'GET_ALLBILLER_PAYMENT_ITEM_RESET',

    VALIDATE_CUSTOMER_FOR_BILL_SUCCESS : 'VALIDATE_CUSTOMER_FOR_BILL_SUCCESS',
    VALIDATE_CUSTOMER_FOR_BILL_PENDING : 'VALIDATE_CUSTOMER_FOR_BILL_PENDING',
    VALIDATE_CUSTOMER_FOR_BILL_FAILURE : 'VALIDATE_CUSTOMER_FOR_BILL_FAILURE',
    VALIDATE_CUSTOMER_FOR_BILL_RESET : 'VALIDATE_CUSTOMER_FOR_BILL_RESET',

    PAY_FOR_BILL_SUCCESS : 'PAY_FOR_BILL_SUCCESS',
    PAY_FOR_BILL_PENDING : 'PAY_FOR_BILL_PENDING',
    PAY_FOR_BILL_FAILURE : 'PAY_FOR_BILL_FAILURE',
    PAY_FOR_BILL_RESET : 'PAY_FOR_BILL_RESET',
    
}