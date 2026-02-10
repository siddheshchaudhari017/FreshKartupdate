const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Create Winston logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'freshkart-auth' },
    transports: [
        // Write all logs to console
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, ...metadata }) => {
                    let msg = `${timestamp} [${level}]: ${message}`;
                    if (Object.keys(metadata).length > 0) {
                        msg += ` ${JSON.stringify(metadata)}`;
                    }
                    return msg;
                })
            )
        }),
        // Write all logs with level 'info' and below to combined.log
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        // Write all logs with level 'error' and below to error.log
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        // Write security events to separate file
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/security.log'),
            level: 'warn',
            maxsize: 5242880, // 5MB
            maxFiles: 10
        })
    ]
});

// Security event logger
const logSecurityEvent = (event, details = {}) => {
    logger.warn('SECURITY_EVENT', {
        event,
        timestamp: new Date().toISOString(),
        ...details
    });
};

// Audit logger for authentication events
const auditLogger = {
    // Log successful login
    loginSuccess: (userId, email, ip, userAgent) => {
        logSecurityEvent('LOGIN_SUCCESS', {
            userId,
            email,
            ip,
            userAgent
        });
    },

    // Log failed login attempt
    loginFailure: (email, ip, userAgent, reason) => {
        logSecurityEvent('LOGIN_FAILURE', {
            email,
            ip,
            userAgent,
            reason
        });
    },

    // Log account lockout
    accountLocked: (userId, email, ip) => {
        logSecurityEvent('ACCOUNT_LOCKED', {
            userId,
            email,
            ip,
            reason: 'Too many failed login attempts'
        });
    },

    // Log registration
    registration: (userId, email, role, ip) => {
        logSecurityEvent('REGISTRATION', {
            userId,
            email,
            role,
            ip
        });
    },

    // Log password reset request
    passwordResetRequest: (email, ip) => {
        logSecurityEvent('PASSWORD_RESET_REQUEST', {
            email,
            ip
        });
    },

    // Log password reset success
    passwordResetSuccess: (userId, email, ip) => {
        logSecurityEvent('PASSWORD_RESET_SUCCESS', {
            userId,
            email,
            ip
        });
    },

    // Log password change
    passwordChange: (userId, email, ip) => {
        logSecurityEvent('PASSWORD_CHANGE', {
            userId,
            email,
            ip
        });
    },

    // Log role change
    roleChange: (targetUserId, targetEmail, oldRole, newRole, changedBy) => {
        logSecurityEvent('ROLE_CHANGE', {
            targetUserId,
            targetEmail,
            oldRole,
            newRole,
            changedBy
        });
    },

    // Log permission change
    permissionChange: (targetUserId, targetEmail, permissions, changedBy) => {
        logSecurityEvent('PERMISSION_CHANGE', {
            targetUserId,
            targetEmail,
            permissions,
            changedBy
        });
    },

    // Log email verification
    emailVerified: (userId, email) => {
        logSecurityEvent('EMAIL_VERIFIED', {
            userId,
            email
        });
    },

    // Log suspicious activity
    suspiciousActivity: (description, details) => {
        logSecurityEvent('SUSPICIOUS_ACTIVITY', {
            description,
            ...details
        });
    },

    // Log access denied
    accessDenied: (userId, email, resource, requiredRole, ip) => {
        logSecurityEvent('ACCESS_DENIED', {
            userId,
            email,
            resource,
            requiredRole,
            ip
        });
    }
};

module.exports = {
    logger,
    auditLogger
};
