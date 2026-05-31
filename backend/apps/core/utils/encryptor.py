from cryptography.fernet import Fernet
from django.conf import settings


def _encrypt_var(value: str):
    fernet = Fernet(settings.ENCRYPTION_KEY)
    encrypted_value = fernet.encrypt(value.encode())
    return encrypted_value.decode()

def _decrypt_var(encrypted_value: str):
    fernet = Fernet(settings.ENCRYPTION_KEY)
    decrypted = fernet.decrypt(encrypted_value.encode())  # str → bytes first
    return decrypted.decode()   
