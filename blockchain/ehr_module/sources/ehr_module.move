/// Module: ehr_module
module ehr_module::ehr_module {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    // Placeholder for Walrus module (replace with actual import)
    use ehr_module::walrus_mock as walrus;

    public struct EHR has key, store {
        id: UID,
        wallet_id: address,
        blob_id: vector<u8>,
    }

    // Store EHR data on Walrus and create an EHR object
    public entry fun store_ehr(encrypted_data: vector<u8>, wallet_id: address, ctx: &mut TxContext) {
        let blob_id = walrus::store(encrypted_data); // Mock or real Walrus call
        let ehr = EHR {
            id: object::new(ctx),
            wallet_id,
            blob_id,
        };
        transfer::transfer(ehr, wallet_id);
    }

    // Retrieve EHR metadata (for hospitals with permission)
    public fun get_ehr(ehr: &EHR): (address, vector<u8>) {
        (ehr.wallet_id, ehr.blob_id)
    }

    // Update EHR with new blob_id (e.g., after appending data)
    public entry fun update_ehr(ehr: &mut EHR, new_encrypted_data: vector<u8>, sender: address, ctx: &mut TxContext) {
        assert!(ehr.wallet_id == sender, 0); // Only owner can update
        let new_blob_id = walrus::store(new_encrypted_data);
        ehr.blob_id = new_blob_id;
    }
}

// Mock Walrus module for testing
module ehr_module::walrus_mock {
    public fun store(_data: vector<u8>): vector<u8> {
        // Return dummy blob_id for testing
        b"mock_blob_id"
    }
}