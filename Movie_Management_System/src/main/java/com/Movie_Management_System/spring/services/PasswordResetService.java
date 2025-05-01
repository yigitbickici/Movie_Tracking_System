package com.Movie_Management_System.spring.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class PasswordResetService {

    @Autowired
    private JavaMailSender mailSender;

    private final ConcurrentHashMap<String, ResetCode> resetCodes = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public void sendResetCode(String email) {
        String code = generateResetCode();
        resetCodes.put(email, new ResetCode(code, LocalDateTime.now()));

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset Code");
        message.setText("Your password reset code is: " + code + "\nThis code will expire in 10 minutes.");
        
        mailSender.send(message);
    }

    public boolean validateResetCode(String email, String code) {
        ResetCode resetCode = resetCodes.get(email);
        if (resetCode == null) {
            return false;
        }

        if (ChronoUnit.MINUTES.between(resetCode.getTimestamp(), LocalDateTime.now()) > 10) {
            resetCodes.remove(email);
            return false;
        }

        return resetCode.getCode().equals(code);
    }

    public void removeResetCode(String email) {
        resetCodes.remove(email);
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