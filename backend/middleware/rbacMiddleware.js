// Middleware to check if user has required role(s)
const requireRole = (roles) => {
    // Convert single role to array
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    return async (req, res, next) => {
        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized, no user found');
        }

        // Check if user has any of the allowed roles
        if (allowedRoles.includes(req.user.role)) {
            next();
        } else {
            res.status(403);
            throw new Error(`Access denied. Required role: ${allowedRoles.join(' or ')}`);
        }
    };
};

// Middleware to check if user has specific permission
const requirePermission = (permission) => {
    return async (req, res, next) => {
        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized, no user found');
        }

        // Admin has all permissions
        if (req.user.role === 'admin') {
            return next();
        }

        // Check if user has the required permission
        if (req.user.permissions && req.user.permissions.includes(permission)) {
            next();
        } else {
            res.status(403);
            throw new Error(`Access denied. Required permission: ${permission}`);
        }
    };
};

// Middleware to check if user owns the resource
const requireOwnership = (resourceField = 'user') => {
    return async (req, res, next) => {
        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized, no user found');
        }

        // Admin can access any resource
        if (req.user.role === 'admin') {
            return next();
        }

        // Get resource from request (could be in params, body, or loaded resource)
        const resource = req.resource || req.body;

        if (!resource) {
            res.status(404);
            throw new Error('Resource not found');
        }

        // Check ownership
        const resourceUserId = resource[resourceField]?.toString() || resource[resourceField];
        const currentUserId = req.user._id.toString();

        if (resourceUserId === currentUserId) {
            next();
        } else {
            res.status(403);
            throw new Error('Access denied. You do not own this resource');
        }
    };
};

// Role hierarchy helper
const hasHigherRole = (userRole, targetRole) => {
    const roleHierarchy = {
        'admin': 4,
        'moderator': 3,
        'seller': 2,
        'buyer': 1
    };

    return roleHierarchy[userRole] > roleHierarchy[targetRole];
};

// Middleware to check role hierarchy
const requireHigherRole = (targetRoleField = 'role') => {
    return async (req, res, next) => {
        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized, no user found');
        }

        const targetRole = req.body[targetRoleField] || req.params[targetRoleField];

        if (!targetRole) {
            res.status(400);
            throw new Error('Target role not specified');
        }

        if (req.user.role === 'admin' || hasHigherRole(req.user.role, targetRole)) {
            next();
        } else {
            res.status(403);
            throw new Error('Access denied. Insufficient role privileges');
        }
    };
};

module.exports = {
    requireRole,
    requirePermission,
    requireOwnership,
    requireHigherRole,
    hasHigherRole
};
