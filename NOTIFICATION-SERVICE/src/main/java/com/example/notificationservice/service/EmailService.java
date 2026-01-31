package com.example.notificationservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    /**
     * Sends an HTML email using a Thymeleaf template
     * 
     * @param to           Recipient email address
     * @param subject      Email subject
     * @param templateName Name of the Thymeleaf template (without .html extension)
     * @param variables    Variables to be used in the template
     * @return true if email was sent successfully, false otherwise
     */
    public boolean sendEmail(String to, String subject, String templateName, Map<String, Object> variables) {
        try {
            // Create Thymeleaf context with variables
            Context context = new Context();
            context.setVariables(variables);

            // Process the template
            String htmlContent = templateEngine.process("emails/" + templateName, context);

            // Create and send the email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = HTML
            helper.setFrom("noreply@bidconnect.com");

            mailSender.send(message);

            log.info("Email sent successfully to {} with template {}", to, templateName);
            return true;

        } catch (MessagingException e) {
            log.error("Failed to send email to {} with template {}: {}", to, templateName, e.getMessage());
            return false;
        } catch (Exception e) {
            log.error("Unexpected error sending email to {}: {}", to, e.getMessage());
            return false;
        }
    }
}
