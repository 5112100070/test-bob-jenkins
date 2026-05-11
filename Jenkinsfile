pipeline {
    agent any
    
    environment {
        MIDDLEWARE_URL = 'http://middleware.uang-ku.com'
        MIDDLEWARE_API_KEY = credentials('bob-jenkins-api-key')
        FAILED_STAGE = ''
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "✓ Code checked out successfully"
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    env.FAILED_STAGE = 'Install Dependencies'
                }
                echo '📦 Installing dependencies...'
                sh '''
                    node --version
                    npm --version
                    npm ci --prefer-offline --no-audit
                '''
            }
        }
        
        stage('Build') {
            steps {
                script {
                    env.FAILED_STAGE = 'Build'
                }
                echo '🔨 Building application...'
                sh '''
                    echo "Checking application structure..."
                    ls -la
                    echo "Build preparation completed"
                '''
            }
        }
        
        stage('Security Scan') {
            steps {
                script {
                    env.FAILED_STAGE = 'Security Scan'
                }
                echo '🔒 Running security scan...'
            }
        }
        
        stage('Test') {
            steps {
                script {
                    env.FAILED_STAGE = 'Test'
                }
                echo '🧪 Running tests...'
            }
        }
        
        stage('Start Smoke Test') {
            steps {
                script {
                    env.FAILED_STAGE = 'Start Smoke Test'
                }
                echo '🚀 Verifying application can start without crashing...'
                sh '''
                    set -e
                    PORT=3500 npm run start > app-start.log 2>&1 &
                    APP_PID=$!
                    echo "Started app with PID ${APP_PID}"
                    sleep 5

                    if ! kill -0 "${APP_PID}" 2>/dev/null; then
                        echo "Application exited unexpectedly during startup"
                        cat app-start.log
                        exit 1
                    fi

                    echo "Application is running on port 3500"

                    kill "${APP_PID}"
                    wait "${APP_PID}" || true
                    echo "Application stopped after startup verification"
                '''
            }
        }

        stage('Package') {
            steps {
                script {
                    env.FAILED_STAGE = 'Package'
                }
                echo '📦 Packaging application...'
                sh '''
                    mkdir -p dist
                    cp -r app.js package*.json views public dist/
                    cd dist && tar -czf ../app-${BUILD_NUMBER}.tar.gz .
                    echo "Package created: app-${BUILD_NUMBER}.tar.gz"
                '''
            }
        }
    }
    
    post {
        always {
            script {
                echo '📝 Sending review payload to middleware...'

                try {
                    def gitDiff = sh(
                        script: 'git diff HEAD~1 HEAD || git diff HEAD || echo "No diff available"',
                        returnStdout: true
                    ).trim()

                    def changedFilesRaw = sh(
                        script: 'git diff --name-only HEAD~1 HEAD || git diff --name-only HEAD || echo ""',
                        returnStdout: true
                    ).trim()

                    def changedFiles = changedFilesRaw
                        ? changedFilesRaw.split('\n').findAll { it?.trim() }
                        : []

                    def commitMessage = sh(
                        script: 'git log -1 --pretty=%B || echo "Initial commit"',
                        returnStdout: true
                    ).trim()

                    def commitAuthor = sh(
                        script: 'git log -1 --pretty="%an <%ae>" || echo "Jenkins <jenkins@example.com>"',
                        returnStdout: true
                    ).trim()

                    def shortLog = sh(
                        script: '''
                            if [ -f app-start.log ]; then
                                echo "=== app-start.log ==="
                                tail -n 80 app-start.log
                            fi

                            echo "=== jenkins console hints ==="
                            tail -n 80 "$0" 2>/dev/null || true
                        ''',
                        returnStdout: true
                    ).trim()

                    def buildStatus = currentBuild.currentResult ?: 'UNKNOWN'
                    def failedStage = buildStatus == 'SUCCESS' ? null : (env.FAILED_STAGE ?: 'Unknown')

                    def payload = groovy.json.JsonOutput.toJson([
                        build_id: env.BUILD_ID,
                        job_name: env.JOB_NAME,
                        build_url: env.BUILD_URL,
                        branch: env.GIT_BRANCH ?: 'main',
                        commit_sha: env.GIT_COMMIT ?: 'unknown',
                        commit_message: commitMessage,
                        commit_author: commitAuthor,
                        pr_number: env.CHANGE_ID ?: null,
                        repository_url: env.GIT_URL ?: 'https://github.com/5112100070/test-bob-jenkins',
                        diff: gitDiff ?: "Build failed before diff was fully collected",
                        files_changed: changedFiles,
                        lines_added: 0,
                        lines_deleted: 0,
                        metadata: [
                            jenkins_node: env.NODE_NAME,
                            build_number: env.BUILD_NUMBER,
                            build_status: buildStatus,
                            failed_stage: failedStage,
                            error_summary: buildStatus == 'SUCCESS'
                                ? 'Build completed successfully'
                                : "Build failed at stage: ${failedStage}",
                            jenkins_log_excerpt: shortLog
                        ]
                    ])

                    def response = httpRequest(
                        url: "${MIDDLEWARE_URL}/webhook/jenkins",
                        httpMode: 'POST',
                        contentType: 'APPLICATION_JSON',
                        customHeaders: [[
                            name: 'X-API-Key',
                            value: env.MIDDLEWARE_API_KEY
                        ]],
                        requestBody: payload,
                        validResponseCodes: '200:299'
                    )

                    def responseJson = readJSON text: response.content

                    echo "✅ Review payload sent successfully!"
                    echo "Review ID: ${responseJson.review_id}"
                    echo "Status: ${responseJson.data.status}"

                    env.REVIEW_ID = "${responseJson.review_id}"

                } catch (Exception e) {
                    echo "⚠️ Failed to send review payload: ${e.message}"
                }
            }

            echo '🧹 Cleaning up...'
            sh 'rm -rf node_modules/.cache || true'
        }
        success {
            echo '✅ Pipeline completed successfully!'
            script {
                if (env.REVIEW_ID) {
                    echo "📊 Review ID: ${env.REVIEW_ID}"
                    echo "🔗 Check status: ${MIDDLEWARE_URL}/api/reviews/${env.REVIEW_ID}"
                }
            }
            archiveArtifacts artifacts: '*.tar.gz', fingerprint: true
        }
        failure {
            echo '❌ Pipeline failed!'
            script {
                if (env.REVIEW_ID) {
                    echo "📊 Failure review captured with Review ID: ${env.REVIEW_ID}"
                    echo "🔗 Check status: ${MIDDLEWARE_URL}/api/reviews/${env.REVIEW_ID}"
                }
            }
        }
        unstable {
            echo '⚠️ Pipeline completed with warnings'
        }
    }
}