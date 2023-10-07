pipeline{
    
    agent any
    
    environment {
        KUBE_CONFIG = credentials('Kubernetes')
        buid_number = "${BUILD_NUMBER}"
    }
    
    stages{
        stage("git checkout"){
            steps{
                echo "From Github"
                git url:"https://github.com/hacknovas/QuickChat.git",branch: "devOps"
            }
        }
        
        stage("Build Image"){
            steps{
                echo "Building Images"
                sh "docker build -t prathameshdoni/quickchat_frontend:${buid_number} . -f Dockerfile1"
                sh "docker build -t prathameshdoni/quickchat_backend:${buid_number} . -f Dockerfile2"
            }
        }
        
        stage("Push to Dockerhub"){
            steps{
                withCredentials([usernamePassword(credentialsId:"DockerHub",passwordVariable:"pass1",usernameVariable:"user1")]){
                    echo "pushing to docker hub"
                    sh "docker login -u ${user1} -p ${pass1}"
                    sh "docker push prathameshdoni/quickchat_frontend:${buid_number}"
                    sh "docker push prathameshdoni/quickchat_backend:${buid_number}"
                    
                    sh "docker rmi prathameshdoni/quickchat_frontend:${buid_number} --force"
                    sh "docker rmi prathameshdoni/quickchat_backend:${buid_number} --force"
                }
            }
        }
        
        stage("Deploy on k8s"){
            steps {
                script {
                    withCredentials([file(credentialsId: 'Kubernetes', variable: 'KUBE_CONFIG')]) {
                        echo "Deploying on K8s"
                        sh 'cp $KUBE_CONFIG $HOME/.kube/config'
                        sh 'kubectl config use-context minikube' // Set your Kubernetes context
                        
                        dir('k8s') {
    
                            sh "sed -i 's/latest/${buid_number}/g' backend-deployment.yaml"
                            sh "sed -i 's/latest/${buid_number}/g' frontend-deployment.yaml"
                        
                            sh "cat frontend-deployment.yaml"
                            sh "cat backend-deployment.yaml"
                        
                            sh "kubectl apply -f ."
                        }
                    }
                }
            }
        }
    }
}
