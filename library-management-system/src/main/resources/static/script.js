// Global variables
let students = [];
let tables = [];
let rooms = [];
let allTables = []; // All 60 tables (4 rooms × 15 tables)

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeRooms();
    loadDashboard();
    loadStudents();
    loadTables();
    loadRooms();
    setupEventListeners();
    setupModals();
    setupSearch();
});

// Initialize 4 rooms with 15 tables each
function initializeRooms() {
    const roomNames = ['A', 'B', 'C', 'D'];
    const roomNumbers = ['A', 'B', 'C', 'D'];
    
    rooms = roomNames.map((name, index) => ({
        id: index + 1,
        name: name,
        roomNumber: roomNumbers[index],
        tables: []
    }));
    
    // Create 15 tables for each room
    rooms.forEach(room => {
        for (let i = 1; i <= 15; i++) {
            const table = {
                id: `${room.roomNumber}-T${i}`,
                roomNumber: room.roomNumber,
                tableNumber: i,
                roomName: room.name,
                isOccupied: false,
                student: null,
                payment: null
            };
            room.tables.push(table);
            allTables.push(table);
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('assignmentForm').addEventListener('submit', handleAssignment);
    document.getElementById('roomNumber').addEventListener('change', handleRoomChange);
}

// Setup modals
function setupModals() {
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.close');
    
    closeBtns.forEach(btn => {
        btn.onclick = function() {
            btn.closest('.modal').style.display = "none";
        }
    });
    
    window.onclick = function(event) {
        modals.forEach(modal => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    }
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchStudent');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterStudents(searchTerm);
    });
}

// Filter students based on search term
function filterStudents(searchTerm) {
    const filteredStudents = students.filter(student => 
        student.studentName?.toLowerCase().includes(searchTerm) ||
        student.rollNumber?.toLowerCase().includes(searchTerm) ||
        student.contactNumber?.includes(searchTerm) ||
        student.roomNumber?.toLowerCase().includes(searchTerm)
    );
    displayStudents(filteredStudents);
}

// Tab switching
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.content-section').forEach(tab => {
        tab.style.display = 'none';
    });

// Clear all student data
async function clearStudentData() {
    if (!confirm('⚠️ WARNING: This will permanently delete ALL student data, payments, and table assignments!\n\nThis action cannot be undone. Are you sure you want to continue?')) {
        return;
    }

    const clearBtn = document.getElementById('clearDataBtn');
    const originalText = clearBtn.innerHTML;
    
    try {
        clearBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Clearing Data...';
        clearBtn.disabled = true;
        
        const response = await fetch('/api/cleanup/students', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            // Show success message
            showNotification('✅ All student data cleared successfully!', 'success');
            
            // Refresh all data
            await Promise.all([
                loadStudents(),
                loadTables(),
                loadDashboard(),
                loadRooms()
            ]);
            
            // Reset form
            document.getElementById('assignmentForm').reset();
            
        } else {
            const errorText = await response.text();
            throw new Error(errorText);
        }
        
    } catch (error) {
        console.error('Error clearing data:', error);
        showNotification(`❌ Error clearing data: ${error.message}`, 'error');
    } finally {
        clearBtn.innerHTML = originalText;
        clearBtn.disabled = false;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.background = '#28a745';
    } else if (type === 'error') {
        notification.style.background = '#dc3545';
    } else {
        notification.style.background = '#17a2b8';
    }
    
    notification.textContent = message;
    
    // Add close button
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        margin-left: 15px;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
    `;
    closeBtn.onclick = () => notification.remove();
    notification.appendChild(closeBtn);
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').style.display = 'block';
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    // Refresh data for specific tabs
    if (tabName === 'room-layout') {
        renderDetailedRoomLayout();
    } else if (tabName === 'fee-management') {
        loadFeeManagement();
    }
}

// Render the quick room overview
function renderRoomOverview() {
    const container = document.getElementById('rooms-overview');
    
    const roomsHTML = rooms.map(room => {
        const occupiedCount = room.tables.filter(t => t.isOccupied).length;
        const vacantCount = 15 - occupiedCount;
        
        const tablesHTML = room.tables.map(table => {
            const isOccupied = table.isOccupied;
            const student = table.student;
            const tableClass = isOccupied ? 'occupied' : 'vacant';
            const tableText = isOccupied ? 'O' : table.tableNumber;
            
            let tooltipText = `Table ${table.tableNumber}`;
            if (isOccupied && student) {
                tooltipText = `${student.name} - ₹${student.payment?.amount || 0}`;
            }
            
            return `
                <div class="table ${tableClass}" 
                     onclick="showTableDetails('${table.id}')"
                     data-table-id="${table.id}">
                    ${tableText}
                    <div class="table-info">${tooltipText}</div>
                </div>
            `;
        }).join('');
        
        return `
            <div class="room-card">
                <div class="room-header">
                    <h3>${room.roomNumber}</h3>
                    <p>Room ${room.roomNumber} - ${occupiedCount} occupied, ${vacantCount} vacant</p>
                </div>
                <div class="tables-grid">
                    ${tablesHTML}
                </div>
                <div class="quick-actions">
                    <button class="btn btn-success" onclick="showVacantTables('${room.roomNumber}')">
                        <i class="fas fa-eye"></i> View Vacant
                    </button>
                    <button class="btn btn-warning" onclick="showRoomStats('${room.roomNumber}')">
                        <i class="fas fa-chart-bar"></i> Stats
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = roomsHTML;
}

// Render detailed room layout
function renderDetailedRoomLayout() {
    const container = document.getElementById('detailed-rooms');
    renderRoomOverview(); // Reuse the same function for detailed view
}

// Show vacant tables for a specific room
function showVacantTables(roomNumber) {
    const room = rooms.find(r => r.roomNumber === roomNumber);
    if (!room) return;
    
    const vacantTables = room.tables.filter(t => !t.isOccupied);
    
    const modal = document.getElementById('tableModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = `Vacant Tables - ${roomNumber}`;
    modalBody.innerHTML = `
        <div style="margin-bottom: 20px;">
you check it            <h4>Available Tables in ${room.roomNumber}</h4>
            <p>Total vacant tables: ${vacantTables.length}</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
            ${vacantTables.map(table => `
                <div style="background: #28a745; color: white; padding: 15px; border-radius: 8px; text-align: center; cursor: pointer;" 
                     onclick="selectTableForAssignment('${table.roomNumber}', ${table.tableNumber})">
                    <strong>Table ${table.tableNumber}</strong>
                </div>
            `).join('')}
        </div>
        <div style="text-align: center; color: #666;">
            Click on a table to select it for assignment
        </div>
    `;
    
    modal.style.display = "block";
}

// Select table for assignment
function selectTableForAssignment(roomNumber, tableNumber) {
    document.getElementById('roomNumber').value = roomNumber;
    handleRoomChange();
    document.getElementById('tableNumber').value = tableNumber;
    
    // Close modal and scroll to assignment form
    document.getElementById('tableModal').style.display = "none";
    document.querySelector('.admin-controls').scrollIntoView({ behavior: 'smooth' });
}

// Show room statistics
function showRoomStats(roomNumber) {
    const room = rooms.find(r => r.roomNumber === roomNumber);
    if (!room) return;
    
    const occupiedTables = room.tables.filter(t => t.isOccupied);
    const totalRevenue = occupiedTables.reduce((sum, t) => sum + (t.payment?.amount || 0), 0);
    
    const modal = document.getElementById('tableModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = `Room Statistics - ${roomNumber}`;
    modalBody.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4>${room.roomNumber} Statistics</h4>
        </div>
        <div class="detail-row">
            <span class="detail-label">Total Tables:</span>
            <span class="detail-value">15</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Occupied Tables:</span>
            <span class="detail-value" style="color: #dc3545;">${occupiedTables.length}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Vacant Tables:</span>
            <span class="detail-value" style="color: #28a745;">${15 - occupiedTables.length}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Occupancy Rate:</span>
            <span class="detail-value">${((occupiedTables.length / 15) * 100).toFixed(1)}%</span>
        </div>
        <div class="fee-section">
            <div class="detail-label">Total Revenue:</div>
            <div class="fee-amount">₹${totalRevenue}</div>
        </div>
    `;
    
    modal.style.display = "block";
}

// Show table details modal
function showTableDetails(tableId) {
    const table = allTables.find(t => t.id === tableId);
    if (!table) return;
    
    const modal = document.getElementById('tableModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (table.isOccupied && table.student) {
        // Show occupied table details
        modalTitle.textContent = `Table ${table.tableNumber} - ${table.roomNumber}`;
        modalBody.innerHTML = `
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value" style="color: #dc3545; font-weight: bold;">Occupied</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Student Name:</span>
                <span class="detail-value">${table.student.name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Roll Number:</span>
                <span class="detail-value">${table.student.rollNumber || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Contact:</span>
                <span class="detail-value">${table.student.contactNumber || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Room:</span>
                <span class="detail-value">${table.roomNumber}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Table:</span>
                <span class="detail-value">${table.tableNumber}</span>
            </div>
            <div class="fee-section">
                <div class="detail-label">Payment Details:</div>
                <div class="fee-amount">₹${table.payment?.amount || 0}</div>
                <div style="text-align: center; margin-top: 10px;">
                    <span class="detail-value" style="color: ${table.payment?.paid ? '#28a745' : '#dc3545'};">
                        ${table.payment?.paid ? 'Paid' : 'Unpaid'}
                    </span>
                </div>
            </div>
            <div style="margin-top: 20px; text-align: center;">
                <button class="btn btn-warning" onclick="editStudent('${table.student.id}')">
                    <i class="fas fa-edit"></i> Edit Student
                </button>
                <button class="btn btn-success" onclick="updateFee('${table.student.id}')">
                    <i class="fas fa-money-bill"></i> Update Fee
                </button>
                <button class="btn btn-danger" onclick="removeStudent('${table.student.id}')">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
    } else {
        // Show vacant table details
        modalTitle.textContent = `Table ${table.tableNumber} - ${table.roomNumber}`;
        modalBody.innerHTML = `
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value" style="color: #28a745; font-weight: bold;">Available</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Room:</span>
                <span class="detail-value">${table.roomNumber}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Table Number:</span>
                <span class="detail-value">${table.tableNumber}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Room Name:</span>
                <span class="detail-value">${table.roomName}</span>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #666;">
                This table is available for assignment
            </div>
            <div style="margin-top: 20px; text-align: center;">
                <button class="btn btn-success" onclick="selectTableForAssignment('${table.roomNumber}', ${table.tableNumber})">
                    <i class="fas fa-plus"></i> Assign Student
                </button>
            </div>
        `;
    }
    
    modal.style.display = "block";
}

// Load dashboard statistics
async function loadDashboard() {
    try {
        const [studentsRes, tablesRes] = await Promise.all([
            fetch('/api/students/complete-info'),
            fetch('/api/students/available-tables')
        ]);
        
        const studentsData = await studentsRes.json();
        const tablesData = await tablesRes.json();
        
        // Update dashboard stats
        document.getElementById('totalStudents').textContent = studentsData.length;
        document.getElementById('totalTables').textContent = allTables.length; // 60 total tables
        document.getElementById('availableTables').textContent = tablesData.length;
        document.getElementById('totalRevenue').textContent = '₹' + studentsData.reduce((sum, s) => sum + (s.amountPaid || 0), 0);
        
        // Update table occupancy status
        updateTableStatus(studentsData, tablesData);
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Update table status based on student data
function updateTableStatus(studentsData, availableTablesData) {
    // Reset all tables to vacant
    allTables.forEach(table => {
        table.isOccupied = false;
        table.student = null;
        table.payment = null;
    });
    
    // Mark occupied tables
    studentsData.forEach(student => {
        if (student.roomNumber && student.tableNumber) {
            // Use roomNumber as is
            const tableId = `${student.roomNumber}-T${student.tableNumber}`;
            const table = allTables.find(t => t.id === tableId);
            if (table) {
                table.isOccupied = true;
                table.student = {
                    id: student.id,
                    name: student.studentName,
                    rollNumber: student.rollNumber,
                    contactNumber: student.contactNumber
                };
                table.payment = {
                    amount: student.amountPaid,
                    paid: student.paid,
                    paymentDate: student.paymentDate,
                    dueDate: student.dueDate
                };
            }
        }
    });
    
    // Re-render the layout
    renderRoomOverview();
}

// Load students data
async function loadStudents() {
    try {
        const response = await fetch('/api/students/complete-info');
        students = await response.json();
        displayStudents(students);
    } catch (error) {
        console.error('Error loading students:', error);
        document.getElementById('students-content').innerHTML = '<div class="error">Error loading students</div>';
    }
}

// Display students in table
function displayStudents(studentsToShow = students) {
    const content = document.getElementById('students-content');
    
    if (studentsToShow.length === 0) {
        content.innerHTML = '<div class="loading">No students found</div>';
        return;
    }
    
    const table = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        
                        <th>Contact</th>
                        <th>Room</th>
                        <th>Table</th>
                        <th>Amount Paid</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${studentsToShow.map(student => `
                        <tr>
                            <td>${student.studentName || 'N/A'}</td>
                            
                            <td>${student.contactNumber || 'N/A'}</td>
                            <td>${student.roomNumber || 'N/A'}</td>
                            <td>${student.tableNumber || 'N/A'}</td>
                            <td>₹${student.amountPaid || 0}</td>
                            <td>
                                <span class="status-badge ${student.paid ? 'status-paid' : 'status-unpaid'}">
                                    ${student.paid ? 'Paid' : 'Unpaid'}
                                </span>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <button class="action-btn edit-btn" onclick="editStudent('${student.id}')" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="action-btn fee-btn" onclick="updateFee('${student.id}')" title="Update Fee">
                                        <i class="fas fa-money-bill"></i>
                                    </button>
                                    <button class="action-btn delete-btn" onclick="removeStudent('${student.id}')" title="Remove">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    content.innerHTML = table;
}

// Load tables data
async function loadTables() {
    try {
        const response = await fetch('/api/students/available-tables');
        const data = await response.json();
        tables = data.map(t => ({
            ...t,
            roomNumber: t.roomNumber // use as is
        }));
    } catch (error) {
        console.error('Error loading tables:', error);
    }
}

// Load rooms for dropdown
async function loadRooms() {
    try {
        const response = await fetch('/api/students/rooms');
        const roomsData = await response.json();
        
        const roomSelect = document.getElementById('roomNumber');
        roomSelect.innerHTML = '<option value="">Select Room</option>';
        
        roomsData.forEach(room => {
            const option = document.createElement('option');
            option.value = room.roomNumber; // keep value uppercase for backend
            option.textContent = (room.roomNumber || '').toLowerCase(); // display lowercase
            roomSelect.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error loading rooms:', error);
    }
}

// Handle room selection change
function handleRoomChange() {
    const roomNumber = document.getElementById('roomNumber').value;
    const tableSelect = document.getElementById('tableNumber');
    
    if (!roomNumber) {
        tableSelect.innerHTML = '<option value="">Select Table</option>';
        return;
    }
    
    // Filter tables by selected room
    const roomTables = tables.filter(t => t.roomNumber === roomNumber);
    
    tableSelect.innerHTML = '<option value="">Select Table</option>';
    roomTables.forEach(table => {
        const option = document.createElement('option');
        option.value = table.tableNumber;
        option.textContent = `Table ${table.tableNumber}`;
        tableSelect.appendChild(option);
    });
}

// Handle assignment form submission
async function handleAssignment(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('studentName').value,
        contactNumber: document.getElementById('contactNumber').value,
        roomNumber: document.getElementById('roomNumber').value,
        tableNumber: parseInt(document.getElementById('tableNumber').value),
        amountPaid: parseFloat(document.getElementById('amountPaid').value)
    };
    
    try {
        const response = await fetch('/api/students/assign', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            const result = await response.text();
            showMessage('success', 'Student assigned successfully!');
            document.getElementById('assignmentForm').reset();
            
            // Refresh data
            loadDashboard();
            loadStudents();
            loadTables();
            loadRooms();
            
        } else {
            const error = await response.text();
            showMessage('error', 'Error: ' + error);
        }
    } catch (error) {
        console.error('Error assigning student:', error);
        showMessage('error', 'Error assigning student. Please try again.');
    }
}

// Load fee management
async function loadFeeManagement() {
    try {
        const response = await fetch('/api/students/complete-info');
        const studentsData = await response.json();
        
        const content = document.getElementById('fee-content');
        
        if (studentsData.length === 0) {
            content.innerHTML = '<div class="loading">No students found</div>';
            return;
        }
        
        const totalRevenue = studentsData.reduce((sum, s) => sum + (s.amountPaid || 0), 0);
        const paidStudents = studentsData.filter(s => s.paid).length;
        const unpaidStudents = studentsData.length - paidStudents;
        
        const feeHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <div class="card">
                    <h3><i class="fas fa-money-bill-wave"></i> Total Revenue</h3>
                    <div class="stat-number">₹${totalRevenue}</div>
                    <div class="stat-label">From all students</div>
                </div>
                <div class="card">
                    <h3><i class="fas fa-check-circle"></i> Paid Students</h3>
                    <div class="stat-number" style="color: #28a745;">${paidStudents}</div>
                    <div class="stat-label">Fees collected</div>
                </div>
                <div class="card">
                    <h3><i class="fas fa-exclamation-triangle"></i> Unpaid Students</h3>
                    <div class="stat-number" style="color: #dc3545;">${unpaidStudents}</div>
                    <div class="stat-label">Pending payment</div>
                </div>
            </div>
            
            <h4>Fee Details by Student</h4>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Room</th>
                            <th>Table</th>
                            <th>Amount Paid</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${studentsData.map(student => `
                            <tr>
                                <td>${student.studentName || 'N/A'}</td>
                                <td>${student.roomNumber || 'N/A'}</td>
                                <td>${student.tableNumber || 'N/A'}</td>
                                <td>₹${student.amountPaid || 0}</td>
                                <td>
                                    <span class="status-badge ${student.paid ? 'status-paid' : 'status-unpaid'}">
                                        ${student.paid ? 'Paid' : 'Unpaid'}
                                    </span>
                                </td>
                                <td>
                                    <button class="action-btn fee-btn" onclick="updateFee('${student.id}')">
                                        <i class="fas fa-money-bill"></i> Update Fee
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        content.innerHTML = feeHTML;
        
    } catch (error) {
        console.error('Error loading fee management:', error);
        document.getElementById('fee-content').innerHTML = '<div class="error">Error loading fee information</div>';
    }
}

// Update fee for a student
function updateFee(studentId) {
    const student = students.find(s => s.id == studentId);
    if (!student) return;
    
    const modal = document.getElementById('feeModal');
    const modalBody = document.getElementById('feeModalBody');
    
    modalBody.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Student Name:</span>
            <span class="detail-value">${student.studentName}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Current Amount Paid:</span>
            <span class="detail-value">₹${student.amountPaid || 0}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Current Status:</span>
            <span class="detail-value" style="color: ${student.paid ? '#28a745' : '#dc3545'};">
                ${student.paid ? 'Paid' : 'Unpaid'}
            </span>
        </div>
        
        <div class="fee-form">
            <h4>Update Payment</h4>
            <div class="form-group">
                <label for="newAmount">New Amount Paid</label>
                <input type="number" id="newAmount" step="0.01" value="${student.amountPaid || 0}" required>
            </div>
            <div class="form-group">
                <label for="months">Validity (months)</label>
                <input type="number" id="months" min="1" step="1" value="${student.durationMonths || 1}" required>
            </div>
            <div class="form-group">
                <label>Validity</label>
                <div id="validityInfo" style="padding: 10px; background: #f8f9fa; border-radius: 6px;">
                    ${renderValidityInfo(student)}
                </div>
            </div>
            <div class="form-group">
                <label for="paymentStatus">Payment Status</label>
                <select id="paymentStatus" required>
                    <option value="true" ${student.paid ? 'selected' : ''}>Paid</option>
                    <option value="false" ${!student.paid ? 'selected' : ''}>Unpaid</option>
                </select>
            </div>
            <button class="btn btn-success" onclick="saveFeeUpdate('${studentId}')">
                <i class="fas fa-save"></i> Update Fee
            </button>
        </div>
    `;
    
    modal.style.display = "block";
}

function renderValidityInfo(student) {
    const months = student.durationMonths || 1;
    const paymentDate = student.paymentDate ? new Date(student.paymentDate) : new Date();
    const dueDate = student.dueDate ? new Date(student.dueDate) : new Date(new Date().setMonth(new Date().getMonth() + months));
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const isExpired = new Date() > dueDate;
    return `
        <div>
            <div><strong>Start:</strong> ${paymentDate.toLocaleDateString(undefined, options)}</div>
            <div><strong>Expires:</strong> <span style="color: ${isExpired ? '#dc3545' : '#28a745'};">${dueDate.toLocaleDateString(undefined, options)}${isExpired ? ' (Expired)' : ''}</span></div>
            <div><strong>Duration:</strong> ${months} month(s)</div>
        </div>
    `;
}

// Save fee update
async function saveFeeUpdate(studentId) {
    const newAmount = parseFloat(document.getElementById('newAmount').value);
    const paymentStatus = document.getElementById('paymentStatus').value === 'true';
    const months = parseInt(document.getElementById('months').value) || 1;
    
    try {
        const response = await fetch(`/api/students/${studentId}/payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: newAmount, paid: paymentStatus, months })
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || 'Failed to update payment');
        }
        showMessage('success', 'Fee updated successfully!');
        document.getElementById('feeModal').style.display = "none";
        
        // Refresh data
        loadDashboard();
        loadStudents();
        if (document.getElementById('fee-management-tab').style.display !== 'none') {
            loadFeeManagement();
        }
        
    } catch (error) {
        console.error('Error updating fee:', error);
        showMessage('error', 'Error updating fee. Please try again.');
    }
}

// Edit student
function editStudent(studentId) {
    const student = students.find(s => s.id == studentId);
    if (!student) return;
    
    // Populate the assignment form with student data
    document.getElementById('studentName').value = student.studentName || '';
    document.getElementById('rollNumber').value = student.rollNumber || '';
    document.getElementById('contactNumber').value = student.contactNumber || '';
    document.getElementById('roomNumber').value = student.roomNumber || '';
    document.getElementById('tableNumber').value = student.tableNumber || '';
    document.getElementById('amountPaid').value = student.amountPaid || '';
    
    // Scroll to assignment form
    document.querySelector('.admin-controls').scrollIntoView({ behavior: 'smooth' });
    
    // Change button text
    const submitBtn = document.querySelector('#assignmentForm button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Student';
    submitBtn.onclick = (e) => handleStudentUpdate(e, studentId);
}

// Handle student update
async function handleStudentUpdate(event, studentId) {
    event.preventDefault();
    
    // Here you would make an API call to update the student
    showMessage('success', 'Student updated successfully!');
    
    // Reset form and button
    document.getElementById('assignmentForm').reset();
    const submitBtn = document.querySelector('#assignmentForm button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Assign Student';
    submitBtn.onclick = handleAssignment;
    
    // Refresh data
    loadDashboard();
    loadStudents();
}

// Remove student
async function removeStudent(studentId) {
    if (!confirm('Are you sure you want to remove this student?')) return;
    
    try {
        const response = await fetch(`/api/students/${studentId}`, { method: 'DELETE' });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || 'Failed to delete student');
        }
        showMessage('success', 'Student removed successfully!');
        
        // Refresh data
        loadDashboard();
        loadStudents();
        
    } catch (error) {
        console.error('Error removing student:', error);
        showMessage('error', 'Error removing student. Please try again.');
    }
}

// Show message
function showMessage(type, message) {  
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;
    
    // Insert at the top of the container
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Refresh data
function refreshData() {
    loadDashboard();
    loadStudents();
    loadTables();
    loadRooms();
}
