pipeline {
    agent any

    environment {
        SOURCE_GITHUB_URL = 'git@github.com:backend20250319/BE09-Final-3team-FE.git'
        MANIFESTS_GITHUB_URL = 'https://github.com/gyongcode/petful-manifest.git'
        GIT_USERNAME = 'gyongcode-jenkins'
        GIT_EMAIL = 'gyongcode@gmail.com'


        // 환경변수 지정
        NEXT_PUBLIC_API_URL = 'https://petful.site/api/v1'

        DISCORD_WEBHOOK_URL = credentials('discord-webhook-url')
    }

    stages {
        stage('Preparation') {
            steps {
                script {
                    bat 'docker --version'
                }
            }
        }
        stage('Source Clone') {
            steps {
                git credentialsId: 'ssh-jenkins-github--key', branch: "${branch.split("/", 3)[2]}", url: "${env.SOURCE_GITHUB_URL}"
            }
        }
        
        stage('Container Build and Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        IMAGE_TAG = "v0.0.${currentBuild.number}"

                        // 나중에 ingress 정해지면 지정
                        bat "docker build --build-arg NEXT_PUBLIC_API_URL=${env.NEXT_PUBLIC_API_URL} -t ${DOCKER_USER}/petful-frontend:${IMAGE_TAG} ."
                        
                        // bat "docker build -t ${DOCKER_USER}/petful-frontend:${IMAGE_TAG} ."
                        bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                        bat "docker push ${DOCKER_USER}/petful-frontend:${IMAGE_TAG}"
                    }
                }
            }
        } 


        stage('K8S Manifest Update') {
            steps {
                git credentialsId: 'github-access-token',
                    url: "${env.MANIFESTS_GITHUB_URL}",
                    branch: 'main'
                script {

                    
                    bat "powershell -Command \"(Get-Content deployment.yml) -replace 'petful-frontend:.*', 'petful-frontend:v0.0.${currentBuild.number}' | Set-Content deployment.yml\""
                    bat "git add deployment.yml"
                    bat "git config --global user.name \"${env.GIT_USERNAME}\""
                    bat "git config --global user.email \"${env.GIT_EMAIL}\""
                    bat "git commit -m \"[CI FRONT] update image tag to v0.0.${currentBuild.number}\""
                    bat "git push origin main"
                    
                }
                
            }
        }
    }

    post {
        always {
            bat 'docker logout'
        }
        success {
            echo 'Pipeline succeeded!'
            bat '''
                curl -H "Content-Type: application/json" ^
                    -d "{\\"content\\":\\"✅ Jenkins Frontend Job 성공: %JOB_NAME% #%BUILD_NUMBER%\\"}" ^
                    %DISCORD_WEBHOOK_URL%
            '''
        }
        failure {
            echo 'Pipeline failed!'
            bat '''
                curl -H "Content-Type: application/json" ^
                    -d "{\\"content\\":\\"❌ Jenkins Frontend Job 실패: %JOB_NAME% #%BUILD_NUMBER%\\"}" ^
                    %DISCORD_WEBHOOK_URL%
            '''
        }
    }
}