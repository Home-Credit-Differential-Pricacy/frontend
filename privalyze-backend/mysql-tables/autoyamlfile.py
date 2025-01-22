import yaml
import re

def parse_sql_to_yaml(sql_file, yaml_file):
    with open(sql_file, 'r') as f:
        sql_content = f.read()

    # Define the metadata structure
    metadata = {"collections": {}}

    # Extract table definitions
    create_table_pattern = re.compile(r'CREATE TABLE (\w+) \((.*?)\);', re.DOTALL)
    tables = create_table_pattern.findall(sql_content)

    for table_name, columns in tables:
        table_metadata = {}
        column_details = {}

        columns = columns.split(',')
        for column in columns:
            column = column.strip()
            column_parts = column.split()
            column_name = column_parts[0]
            column_type = column_parts[1].upper()

            # Map SQL types to metadata types
            column_info = {"type": None}
            if "INT" in column_type:
                column_info["type"] = "int"
            elif "CHAR" in column_type or "TEXT" in column_type:
                column_info["type"] = "string"
            elif "FLOAT" in column_type or "DOUBLE" in column_type:
                column_info["type"] = "float"
            elif "BOOLEAN" in column_type:
                column_info["type"] = "boolean"
            elif "DATE" in column_type or "TIME" in column_type:
                column_info["type"] = "datetime"

            # Example constraints (mocked for demonstration)
            if column_info["type"] in ["int", "float"]:
                column_info["lower"] = 0
                column_info["upper"] = 100
            if column_name.lower() == "deviceid":
                column_info["private_id"] = True

            column_details[column_name] = column_info

        table_metadata["columns"] = column_details
        metadata["collections"][table_name] = table_metadata

    # Write metadata to YAML
    with open(yaml_file, 'w') as f:
        yaml.dump(metadata, f, sort_keys=False, default_flow_style=False)

# Example usage
sql_file_path = "homecreditdefaultrisk_previous_application.sql"
yaml_file_path = "output.yaml"
parse_sql_to_yaml(sql_file_path, yaml_file_path)