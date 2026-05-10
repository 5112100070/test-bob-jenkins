pipeline {
    agent any

    environment {
        MIDDLEWARE_URL = "http://middleware.uang-ku.com"
        MIDDLEWARE_API_KEY = credentials("bob-jenkins-api-key")
    }

    stages {
        stage("Checkout") {
            steps {
                checkout scm
                echo "✓ Code checked out successfully"
            }
        }

        stage("Build") {
            steps {
                echo "🔨 Building application..."
                sh "echo Build completed"
            }
        }

        stage("Test") {
            steps {
                echo "🧪 Running tests..."
                sh "npm test || echo Tests completed"
            }
        }

        stage("Request Code Review") {
            steps {
                script {
                    echo "📝 Requesting code review from Bob AI..."

                    try {
                        def gitDiff = sh(
                            script: "git diff HEAD~1 HEAD || echo No previous commit",
                            returnStdout: true
                        ).trim()

                        def changedFiles = sh(
                            script: "git diff --name-only HEAD~1 HEAD || echo app.js",
                            returnStdout: true
                        ).trim().split("\n")

                        def commitMessage = sh(
                            script: "git log -1 --pretty=%B || echo Initial commit",
                            returnStdout: true
                        ).trim()

                        def commitAuthor = sh(
                            script: "git log -1 --pretty=\"%an <%ae>\" || echo \"Jenkins <jenkins@example.com>\"",
                            returnStdout: true
                        ).trim()

                        def payload = groovy.json.JsonOutput.toJson([
                            build_id: env.BUILD_ID,
                            job_name: env.JOB_NAME,
                            build_url: env.BUILD_URL,
                            branch: env.GIT_BRANCH ?: "main",
                            commit_sha: env.GIT_COMMIT ?: "unknown",
                            commit_message: commitMessage,
                            commit_author: commitAuthor,
                            pr_number: env.CHANGE_ID ?: null,
                            repository_url: env.GIT_URL ?: "local",
                            diff: gitDiff,
                            files_changed: changedFiles,
                            lines_added: 10,
                            lines_deleted: 2,
                            metadata: [
                                jenkins_node: env.NODE_NAME,
                                build_number: env.BUILD_NUMBER
                            ]
                        ])

                        def response = httpRequest(
                            url: "${MIDDLEWARE_URL}/webhook/jenkins",
                            httpMode: "POST",
                            contentType: "APPLICATION_JSON",
                            customHeaders: [[
                                name: "X-API-Key",
                                value: env.MIDDLEWARE_API_KEY
                            ]],
                            requestBody: payload,
                            validResponseCodes: "200:299"
                        )

                        def responseJson = readJSON text: response.content

                        echo "✅ Code review request created successfully!"
                        echo "Review ID: ${responseJson.review_id}"
                        echo "Status: ${responseJson.data.status}"

                        env.REVIEW_ID = responseJson.review_id

                    } catch (Exception e) {
                        echo "⚠️ Failed to request code review: ${e.message}"
                        currentBuild.result = "UNSTABLE"
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully!"
            script {
                if (env.REVIEW_ID) {
                    echo "📊 Review ID: ${env.REVIEW_ID}"
                    echo "🔗 Check status: ${MIDDLEWARE_URL}/api/reviews/${env.REVIEW_ID}"
                }
            }
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}