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
    stage("docker") {
      agent any
      environment {
        registry = 'hyper63/atlas'
        registryCredential = 'dockerhub'
      } 
      stages {
        stage("build") {
          steps {
            docker.build registry + ":$BUILD_NUMBER"
          }
        }
      }
    }
  }
}