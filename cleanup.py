import os
import shutil

base_dir = r"C:\Users\dhruv\Desktop\SmartGrocer-grocery-inventory-management-system"
files_to_delete = [
    "static-test.html",
    "restart_server.bat",
    "src\\test.html",
    "server\\add_bulk_data.js",
    "server\\add_haldiram.js",
    "server\\alter_orders_table.js",
    "server\\init-db.js",
    "server\\setup-db.js",
    "server\\setup.js",
    "server\\setup_tables.js",
    "server\\additional_data.sql",
    "server\\bulk_data.sql",
    "server\\database_extended.sql",
    "server\\SUMMARY.md",
    "cleanup.js"
]

# Delete files
for file in files_to_delete:
    file_path = os.path.join(base_dir, file)
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Deleted {file_path}")
    except Exception as e:
        print(f"Failed to delete {file_path}: {e}")

# Move database.sql
db_dir = os.path.join(base_dir, "database")
try:
    if not os.path.exists(db_dir):
        os.makedirs(db_dir)
        print(f"Created {db_dir}")
    
    old_schema = os.path.join(base_dir, "server", "database.sql")
    new_schema = os.path.join(db_dir, "schema.sql")
    
    if os.path.exists(old_schema):
        shutil.move(old_schema, new_schema)
        print(f"Moved {old_schema} to {new_schema}")
except Exception as e:
    print(f"Failed to move database.sql: {e}")
