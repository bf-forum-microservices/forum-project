package gateway.exception;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import reactor.core.publisher.Mono;

@Component
// Spring Cloud Gateway automatically calls JwtAuthenticationFilter because it's a @Component that implements GlobalFilter.
public class JwtAuthenticationFilter implements GlobalFilter {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        System.out.println(path);

        // 1. Allow public paths
        if (path.startsWith("/auth")
                || path.startsWith("/contact")
                || path.startsWith("/users/register")
                || path.startsWith("/users/verify-email")
                || path.startsWith("/admin/messages")
//                || path.startsWith("/users")
//                || path.startsWith("/postandreply")
//                || path.startsWith("/history")
        ) {
            System.out.println("Allowed public route: " + path);
            return chain.filter(exchange);
        }

        // 2. Require Authorization header
        // exchange: the incoming HTTP request & response.
        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7); // Remove "Bearer "

        try {
            // 3. Validate JWT token
            Claims claims = Jwts.parser()
                    .setSigningKey(jwtSecret.getBytes())
                    .parseClaimsJws(token)
                    .getBody();

            // You can extract claims if needed (like role/status) here

        } catch (Exception e) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // 4. Forward request if token is valid
        return chain.filter(exchange);
    }
}
