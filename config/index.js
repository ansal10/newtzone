let env = process.env.NODE_ENV || "development";
let x = require( "./dev_config.js" );
module.exports = {
	...x,
	baseUploadDir: "public/uploads",
	baseUploadURL: "uploads",
	baseImageUploadDir: "images",
	smtpConfig: {
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: "inboxtest1187@gmail.com",
			pass: "hello@123"
		}
	},
	maintenance: [ "monthly", "deposit", "brokerage", "annually" ],
	MESSAGES: {
		RESOURCE_NOT_FOUND: "Resource not found ",
		RESOURCE_UPDATED_SUCCESSFULLY: "Resource has been updated successfully",
		RESOURCE_CREATED_SUCCESSFULLY: "Resource has been created successfully",
		UNAUTHORIZED_ACCESS: "You are not authorized for this action",
		INVALID_EMAIL: "Your email is invalid",
		EMAIL_VERIFICATION_FAILED: "Your email verification failed, probably your link expired or email already verified.",
		PASSWORD_RESET_FAILED: "Your password token is expired or wrong, in case of expiration you can request a new one.",
		SUCCESSFUL_EMAIL_VERIFICATION: "Your email is successfully verified",
		SUCCESSFULLY_RESEND_CONFIRMATION_MAIL: "Confirmation mail is successfully send.",
		SUCCESSFULLY_PASSWORD_TOKEN_SENT: "Password token been sent successfully",
		SUCCESSFULLY_PASSWORD_RESET: "Password has been reset successfully",
		SIGNUP_SUCCESSFUL_MESSAGE: "Signup successful",
		PASSWORD_MIN_LENGTH: 6,
		INVALID_PASSWORD: "Password should be at least 6 digits long.",
		RECORD_DELETED_SUCCESSFULLY: "Record is deleted successfully",
		MANAGER_NOT_FOUND: "Manager not found"
	},
	pageLimit: 50

};
