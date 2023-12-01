#!/bin/bash

# Define an array of project directories
declare -a projects=("AccountService" "CardService" "ExternalBank" "ExternalTransactionService" "FriendshipService" "FriendTransactionService" "NFCTransactionService" "Proxy" "TransactionService" "UserService")

# Start the overall timer
start_time=$(date +%s)

# Loop through each project directory and execute Maven build
for project in "${projects[@]}"; do
    echo "Building project: $project"
    project_start_time=$(date +%s)

    cd "$project" || exit
    mvn clean install -q
    cd ..

    project_end_time=$(date +%s)
    project_duration=$((project_end_time - project_start_time))
    echo "Project $project built in $project_duration seconds."
done

# End the overall timer
end_time=$(date +%s)
total_duration=$((end_time - start_time))

echo "All projects built successfully in $total_duration seconds."
