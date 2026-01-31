package com.example.notificationservice.enums;

public enum EventType {
    TENDER_PUBLISHED("tender-published", "New Tender Published"),
    SUBMISSION_RECEIVED("submission-received", "Submission Received"),
    SUBMISSION_ACCEPTED("submission-accepted", "Submission Accepted"),
    SUBMISSION_REJECTED("submission-rejected", "Submission Rejected");

    private final String templateName;
    private final String defaultSubject;

    EventType(String templateName, String defaultSubject) {
        this.templateName = templateName;
        this.defaultSubject = defaultSubject;
    }

    public String getTemplateName() {
        return templateName;
    }

    public String getDefaultSubject() {
        return defaultSubject;
    }
}
