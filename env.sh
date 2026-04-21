# Iterate through each environment variable that starts with VITE_APP_
env | grep "^VITE_APP_" | while IFS='=' read -r key value; do
    # Display the variable being replaced
    echo "  • Replacing ${key} → ${value}"

    # Replace in order of most-specific to least-specific so slash-consumption is correct:
    #   /KEY/  → value   (asset paths in index.html, e.g. /VITE_APP_PUBLIC_PATH/assets/…)
    #   /KEY   → value   (leading-slash occurrences in JS, e.g. basename:"/VITE_APP_PUBLIC_PATH")
    #   KEY    → value   (bare occurrences, e.g. "VITE_APP_BACKEND_URL")
    find "/usr/share/nginx/html/" -type f \
        -exec sed -i \
            -e "s|/${key}/|${value}|g" \
            -e "s|/${key}|${value}|g" \
            -e "s|${key}|${value}|g" \
            {} +
done
