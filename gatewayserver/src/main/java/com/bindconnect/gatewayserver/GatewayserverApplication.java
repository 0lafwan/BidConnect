package com.bindconnect.gatewayserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;

@SpringBootApplication
public class GatewayserverApplication {

	public static void main(String[] args) {
		SpringApplication.run(GatewayserverApplication.class, args);
	}


	// this methode is used to configure our chosen routes for the gateway server. we used predifined predicates and filters
	@Bean
	public RouteLocator bindConnectRouteConfig(RouteLocatorBuilder routeLocatorBuilder) {
		return routeLocatorBuilder.routes()
				.route(p -> p
						.path("/bindconnect/tender-service/**")
						.filters( f -> f.rewritePath("/bindconnect/tender-service/(?<segment>.*)","/${segment}")
								.addResponseHeader("X-ResponseTime", LocalDateTime.now().toString())
								.circuitBreaker(c -> c.setName("CircuitBreakerForTender")
										.setFallbackUri("forward:/tenderSupportTeam")))
						.uri("lb://TENDER-SERVICE"))

				.route(p -> p
						.path("/bindconnect/soumission-service/**")
						.filters( f -> f.rewritePath("/bindconnect/soumission-service/(?<segment>.*)","/${segment}")
								.addResponseHeader("X-ResponseTime", LocalDateTime.now().toString()))
						.uri("lb://SOUMISSION-SERVICE"))

				.route(p -> p
						.path("/bindconnect/document-service/**")
						.filters( f -> f.rewritePath("/bindconnect/document-service/(?<segment>.*)","/${segment}")
								.addResponseHeader("X-ResponseTime", LocalDateTime.now().toString()))
						.uri("lb://DOCUMENT-SERVICE"))

				.route(p -> p
						.path("/bindconnect/user-service/**")
						.filters(f -> f.rewritePath("/bindconnect/user-service/(?<segment>.*)", "/${segment}")
								.addResponseHeader("X-ResponseTime", LocalDateTime.now().toString()))
						.uri("lb://USER-SERVICE"))

				.route(p -> p
						.path("/bindconnect/ai-service/**")
						.filters( f -> f.rewritePath("/bindconnect/ai-service/(?<segment>.*)","/${segment}")
								.addResponseHeader("X-ResponseTime", LocalDateTime.now().toString()))
						.uri("lb://AI-SERVICE")).build();





	}


}
