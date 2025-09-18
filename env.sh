# Iterate through each environment variable that starts with VITE_APP_
env | grep "^VITE_APP_" | while IFS='=' read -r key value; do
    # Display the variable being replaced
    echo "  • Replacing ${key} → ${value}"

    # Use find and sed to replace the variable in all files within the directory
    find "/usr/share/nginx/html/" -type f \
        -exec sed -i "s|${key}|${value}|g" {} +
done
