package g2t5.model;

public class ResetPasswordRequest {

    private String username;
    private String tempPassword;
    private String newPassword;

    public String getUsername() {
        return username;
    }

    public String getTempPassword() {
        return tempPassword;

    }

    public String getNewPassword() {
        return newPassword;
    }
}
