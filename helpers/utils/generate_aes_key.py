def generate_aes_key():
    import os
    return os.urandom(32)