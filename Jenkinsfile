pipeline {
    agent any

    environment {
        SOURCE_GITHUB_URL = 'git@github.com:backend20250319/BE09-Final-3team-FE.git'
        MANIFESTS_GITHUB_URL = 'https://github.com/gyongcode/petful-manifest.git'
        GIT_USERNAME = 'gyongcode-jenkins'
        GIT_EMAIL = 'gyongcode@gmail.com'
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
                git credentialsId: 'ssh-jenkins-github--key', branch: "${branch.split("/")[2]}", url: "${env.SOURCE_GITHUB_URL}"
            }
        }
        
        stage('Container Build and Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        IMAGE_TAG = "v0.0.${currentBuild.number}"

                        bat "docker build -t ${DOCKER_USER}/petful-frontend:${IMAGE_TAG} ."
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
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}