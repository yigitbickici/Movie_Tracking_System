package com.Movie_Management_System.spring.interceptor;

import com.Movie_Management_System.spring.services.VisitorService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class VisitorLogInterceptor implements HandlerInterceptor {

    @Autowired
    private VisitorService visitorService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        String pageUrl = request.getRequestURI();

        // Log the visit
        visitorService.logVisit(ipAddress, userAgent, pageUrl);

        return true;
    }
} 