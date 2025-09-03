# Data Cleanup Guide

This guide explains how to clear student data from the Library Management System while preserving the database structure.

## What Gets Cleared

✅ **Data that will be removed:**
- All student records
- All payment records
- All table assignments (students will be unassigned from tables)

✅ **Data that will be preserved:**
- All room records
- All study table records
- Database schema and structure
- Application configuration

## How to Clear Data

### Option 1: Web Interface (Recommended)

1. **Start the application** if it's not already running
2. **Open the admin panel** in your browser
3. **Navigate to the "Data Management" section** (below the Quick Room Overview)
4. **Click the "Clear All Student Data" button**
5. **Confirm the action** when prompted
6. **Wait for completion** - you'll see a success notification

### Option 2: REST API

Make a DELETE request to the cleanup endpoint:

```bash
curl -X DELETE http://localhost:8080/api/cleanup/students
```

### Option 3: Command Line (Windows)

1. **Ensure the application is running**
2. **Double-click** `clear-data.bat` in the project root
3. **Wait for completion** and check the output

## Safety Features

- **Confirmation Dialog**: Web interface shows a warning before proceeding
- **Transaction Safety**: Uses database transactions to ensure data consistency
- **Error Handling**: Graceful error handling with user-friendly messages
- **Audit Trail**: Console logs show what was cleared

## After Cleanup

Once data is cleared:

1. **All tables will be marked as available**
2. **Dashboard statistics will reset to zero**
3. **Student management tables will be empty**
4. **You can start fresh with new student assignments**

## Troubleshooting

### "Application not running" error
- Start the Spring Boot application first
- Ensure it's running on port 8080

### "Database connection failed" error
- Check your MySQL database is running
- Verify database credentials in `application.properties`
- Ensure the `librarydb` database exists

### "Permission denied" error
- Check database user permissions
- Ensure the user has DELETE privileges on all tables

## Database Impact

The cleanup process:
1. Deletes all records from `payment` table
2. Deletes all records from `student` table  
3. Updates all `study_table` records to set `student_id = null` and `occupied = false`
4. Preserves all `room` records

## Reverting Changes

⚠️ **Warning**: This action cannot be undone. Once student data is cleared, it's permanently deleted.

If you need to restore data, you would need to:
- Restore from a database backup
- Re-enter all student information manually
- Re-assign students to tables

## Support

If you encounter issues:
1. Check the application console for error messages
2. Verify database connectivity
3. Ensure all required services are running

