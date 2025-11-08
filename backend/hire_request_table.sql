-- SQL script to create hire_request table
-- Run this in your database before using the hire request feature

CREATE TABLE IF NOT EXISTS hire_request (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    employer_id INT NOT NULL,
    employee_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_date TIMESTAMP NULL,
    message TEXT,
    
    CONSTRAINT fk_hire_employer
        FOREIGN KEY (employer_id) REFERENCES employer(employer_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
        
    CONSTRAINT fk_hire_employee
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
        
    CONSTRAINT unique_hire_request UNIQUE (employer_id, employee_id)
);

-- Index for faster queries
CREATE INDEX idx_hire_status ON hire_request(status);
CREATE INDEX idx_hire_employer ON hire_request(employer_id);
CREATE INDEX idx_hire_employee ON hire_request(employee_id);

-- Note: The 'message' column serves dual purpose:
-- - When status = 'pending': Contains employer's hire request message
-- - When status = 'accepted' or 'rejected': Contains admin's response message

