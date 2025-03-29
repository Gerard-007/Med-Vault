# from twilio.rest import Client
#
# def send_otp(phone_number, otp):
#     client = Client(Config.TWILIO_ACCOUNT_SID, Config.TWILIO_AUTH_TOKEN)
#     message = client.messages.create(
#         body=f"Your OTP is {otp}",
#         from_=Config.TWILIO_PHONE_NUMBER,
#         to=phone_number
#     )
#     return message.sid

# def verify_otp(phone_number, otp):
#     # Implement OTP verification logic here
#     return True  # Placeholder

def send_otp(phone_number, otp):
    ...

def verify_otp(phone_number, otp):
    ...