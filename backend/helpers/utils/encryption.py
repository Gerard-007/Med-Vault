# import json
# from Crypto.Cipher import AES
# import base64
#
# SECRET_KEY = b'your-32-byte-key-here'

# def encrypt_data(data):
#     cipher = AES.new(SECRET_KEY, AES.MODE_EAX)
#     ciphertext, tag = cipher.encrypt_and_digest(json.dumps(data).encode())
#     return base64.b64encode(cipher.nonce + tag + ciphertext).decode()
#
# def decrypt_data(enc_data):
#     enc_data = base64.b64decode(enc_data)
#     nonce, tag, ciphertext = enc_data[:16], enc_data[16:32], enc_data[32:]
#     cipher = AES.new(SECRET_KEY, AES.MODE_EAX, nonce=nonce)
#     return json.loads(cipher.decrypt_and_verify(ciphertext, tag))

import pyaes

def encrypt_data(data, key):
    aes = pyaes.AESModeOfOperationCTR(key)
    encrypted = aes.encrypt(data)
    return encrypted

def decrypt_data(encrypted_data, key):
    aes = pyaes.AESModeOfOperationCTR(key)
    decrypted = aes.decrypt(encrypted_data)
    return decrypted.decode("utf-8")

def store_patient_data(wallet_id, data, key, walrux_api=None):
    encrypted_data = encrypt_data(data, key)
    # walrux api here...
    walrux_api.store(wallet_id, encrypted_data)
