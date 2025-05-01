package com.Movie_Management_System.spring.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class PasswordResetService {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);

    @Autowired
    private JavaMailSender mailSender;

    private final ConcurrentHashMap<String, ResetCode> resetCodes = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public void sendResetCode(String email) {
        try {
            String code = generateResetCode();
            resetCodes.put(email, new ResetCode(code, LocalDateTime.now()));

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Password Reset Code");
            message.setText("Your password reset code is: " + code + "\nThis code will expire in 10 minutes.");
            
            mailSender.send(message);
            logger.info("Reset code sent successfully to: {}", email);
        } catch (Exception e) {
            logger.error("Failed to send reset code to: {}. Error: {}", email, e.getMessage());
            throw new RuntimeException("Failed to send reset code. Please try again later.");
        }
    }

    public boolean validateResetCode(String email, String code) {
        try {
            ResetCode resetCode = resetCodes.get(email);
            if (resetCode == null) {
                logger.warn("No reset code found for email: {}", email);
                return false;
            }

            if (ChronoUnit.MINUTES.between(resetCode.getTimestamp(), LocalDateTime.now()) > 10) {
                resetCodes.remove(email);
                logger.warn("Reset code expired for email: {}", email);
                return false;
            }

            boolean isValid = resetCode.getCode().equals(code);
            if (!isValid) {
                logger.warn("Invalid reset code provided for email: {}", email);
            }
            return isValid;
        } catch (Exception e) {
            logger.error("Error validating reset code for email: {}. Error: {}", email, e.getMessage());
            return false;
        }
    }

    public void removeResetCode(String email) {
        try {
            resetCodes.remove(email);
            logger.info("Reset code removed for email: {}", email);
        } catch (Exception e) {
            logger.error("Error removing reset code for email: {}. Error: {}", email, e.getMessage());
        }
    }

    private String generateResetCode() {
        return String.format("%06d", random.nextInt(1000000));
    }

    private static class ResetCode {
        private final String code;
        private final LocalDateTime timestamp;

        public ResetCode(String code, LocalDateTime timestamp) {
            this.code = code;
            this.timestamp = timestamp;
        }

        public String getCode() {
            return code;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }
    }
} 