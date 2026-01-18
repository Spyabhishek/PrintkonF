pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "iamabhshek/printkonui"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/Spyabhishek/PrintkonF.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                    sh "docker build -t ${DOCKER_IMAGE}:latest ."
                }
            }
        }

        stage('Push to Docker Hub') {
    steps {
        script {
            // This one line handles login, pushing, and logout
            docker.withRegistry('https://index.docker.io/v1/', 'Docker_cred') {
                docker.image("${DOCKER_IMAGE}").push("${DOCKER_TAG}")
                docker.image("${DOCKER_IMAGE}").push("latest")
            }
        }
    }
}

        stage('Deploy') {
            steps {
                script {
                    // Stop existing container if it exists
                    sh "docker stop react-app || true && docker rm react-app || true"
                    // Run the new container
                    sh "docker run -d --name react-app -p 4001:80 ${DOCKER_IMAGE}:latest"
                }
            }
        }
    }

    post {
        always {
            sh "docker logout"
            cleanWs()
        }
    }
}
