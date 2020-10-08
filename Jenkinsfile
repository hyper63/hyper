pipeline {
  agent none
  stages {
    stage("test") {
      agent { docker { image 'node:12' }}
      environment {
        HOME = '.'
        NPM_CONFIG_PREFIX="${pwd()}/.npm-global"
        PATH="$PATH:${pwd()}/.npm-global/bin:${pwd tmp: true}/.npm-global/bin"
      }
      stages {
        stage('setup') {
          steps {
            sh 'yarn'
          }
        }
        stage('test') {
          steps {
            sh 'yarn test'
          }
        }
      }
    }
    stage("staging") {
      agent any
      environment {
        registry = 'hyper63/atlas'
        registryCredential = 'dockerhub'
        dockerImage = ''
      }
      when {
        branch 'staging'
      }
      stages {
        stage('build') {
          steps {
            script {
              dockerImage = docker.build registry + ":unstable"
            }
          }     
        }
        stage('push') {
          steps {
            script {
              docker.withRegistry('', registryCredential) {
                dockerImage.push()
              }
            }
          } 
        }
        stage("cleanup") {
          steps {
            sh "docker rmi $registry:v0.$BUILD_NUMBER"
          }
        }
      }
    }
    stage("docker") {
      agent any
      environment {
        registry = 'hyper63/atlas'
        registryCredential = 'dockerhub'
        dockerImage = ''
      } 
      when {
        branch 'main'
      }
      stages {
        stage("build") {
          steps {
            script {
              dockerImage = docker.build registry + ":v0.$BUILD_NUMBER"
            }
          }
        }
        stage("deploy") {
          steps {
            script {
              docker.withRegistry('', registryCredential) {
                dockerImage.push()
              }
            }
          }
        }
        stage("cleanup") {
          steps {
            sh "docker rmi $registry:v0.$BUILD_NUMBER"
          }
        }
      }
    }
  }
}