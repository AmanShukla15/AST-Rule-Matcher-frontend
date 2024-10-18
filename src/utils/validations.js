const ruleRegex = /^\(\(.*\)\s*(AND|OR)\s*\(.*\)\)$/; // Basic regex for rule format  

export const validateRuleString = (ruleString) => {  
    if (!ruleString || !ruleRegex.test(ruleString)) {  
        return "Invalid rule format. Must follow the pattern: ((condition1) AND/OR (condition2))";  
    }  
    return null;  
};  

export const validateData = (data) => {  
    const { age, department, salary, experience } = data;  
    if (typeof age !== 'number' || age < 0) {  
        return "Invalid age. Must be a non-negative number.";  
    }  
    if (!['Sales', 'Marketing', 'Development'].includes(department)) {  
        return "Invalid department. Must be one of: Sales, Marketing, Development.";  
    }  
    if (typeof salary !== 'number' || salary < 0) {  
        return "Invalid salary. Must be a non-negative number.";  
    }  
    if (typeof experience !== 'number' || experience < 0) {  
        return "Invalid experience. Must be a non-negative number.";  
    }  
    return null;  
};