package com.bindconnect.gatewayserver.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class FallbackControllerForTender {

    @RequestMapping("/tenderSupportTeam")
    public Mono<String> contactSupport() {
        return Mono.just("Error. Please try after some time or contact the support");
    }
}