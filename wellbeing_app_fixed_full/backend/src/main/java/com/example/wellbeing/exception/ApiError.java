package com.example.wellbeing.exception;

import java.time.LocalDateTime;

public record ApiError(String message, LocalDateTime timestamp){}
