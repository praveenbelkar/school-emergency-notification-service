pipeline {

  parameters {
    choice(name: 'ENVIRONMENT_DEPLOY', choices: ['', 'dev', 'test', 'preprod', 'prodsupport', 'prod'], description: 'Select deployment target environment')
  }

  environment {
    ACCOUNT_ID = getAccountId(ENVIRONMENT_DEPLOY)
    DCU_SYSTEM_ID="sct_" + "${params.ENVIRONMENT_DEPLOY}"
    STAFF_DB_USERNAME = credentials("${params.ENVIRONMENT_DEPLOY}_staff_db_username")
    STAFF_DB_PASSWORD = credentials("${params.ENVIRONMENT_DEPLOY}_staff_db_password")
  }

  options {
      // This is required if you want to clean before build
      skipDefaultCheckout(true)
      ansiColor('xterm')
      timestamps()
  }

  agent {
    kubernetes {
      defaultContainer 'terraspace'
      inheritFrom 'terraspace'
    }
  }

  stages {

    stage('Check') {

      when {
        expression { ENVIRONMENT_DEPLOY == "preprod" || ENVIRONMENT_DEPLOY == "prod" || ENVIRONMENT_DEPLOY == "prodsupport" }
      }

      options {
          timeout(time: 1, unit: 'HOURS')
      }

      steps {
          input message: "Should we continue?", ok: "Yes, we should.", submitter: "michael.robinson@det.nsw.edu.au"
      }
    } //End stage check

    stage('Checkout') {
      steps {

        cleanWs()
        checkout scm
      }
    } //End - stage checkout

    stage('Build Lambda') {
      when {
        allOf {
          not {
            branch "release/*"
          }
          expression { ENVIRONMENT_DEPLOY != "preprod" && ENVIRONMENT_DEPLOY != "prod" && ENVIRONMENT_DEPLOY != "prodsupport" }
        }
      }

      parallel {
         stage('build schoolHandler') {
            steps {
              dir('lambda/schoolHandler') {
                sh '''
                  npm ci
                  npm run build
                '''
              }
            }
         }
         stage('build staffHandler') {
            steps {
              dir('lambda/staffHandler') {
                sh '''
                  npm ci
                  npm run build
                '''
              }
            }
         }
         stage('build studentHandler') {
            steps {
              dir('lambda/studentHandler') {
                sh '''
                  npm ci
                  npm run build
                '''
              }
            }
         }
      }
    } // End - stage build lambda

  stage('Run Unit Tests') {

      when {
        allOf {
          not {
            branch "release/*"
          }
          expression { ENVIRONMENT_DEPLOY != "preprod" && ENVIRONMENT_DEPLOY != "prod" && ENVIRONMENT_DEPLOY != "prodsupport" }
        }
      }

      parallel {
        stage('Unit test schoolHandler') {
          steps {
            dir('lambda/schoolHandler') {
              sh '''
                cp -r -f ./tests/events ./dist/tests
                node --experimental-vm-modules node_modules/jest/bin/jest.js --testPathIgnorePatterns=./*/dist/tests/integration/.*\\.js --testPathPattern=./*/dist/tests/.*\\.js --coverage --coverageDirectory ../../coverage --reporters default --reporters='jest-html-reporter' --reporters='jest-junit'
                ls -lat
              '''
            }
          }
        }

        stage('Unit test staffHandler') {
          steps {
            dir('lambda/staffHandler') {
              sh '''
                cp -r -f ./tests/events ./dist/tests
                node --experimental-vm-modules node_modules/jest/bin/jest.js --testPathIgnorePatterns=./*/dist/tests/integration/.*\\.js --testPathPattern=./*/dist/tests/.*\\.js --coverage --coverageDirectory ../../coverage --reporters default --reporters='jest-html-reporter' --reporters='jest-junit'
                ls -lat
              '''
            }
          }
        }

        stage('Unit test studentHandler') {
          steps {
            dir('lambda/studentHandler') {
              sh '''
                cp -r -f ./tests/events ./dist/tests
                node --experimental-vm-modules node_modules/jest/bin/jest.js --testPathIgnorePatterns=./*/dist/tests/integration/.*\\.js --testPathPattern=./*/dist/tests/.*\\.js --coverage --coverageDirectory ../../coverage --reporters default --reporters='jest-html-reporter' --reporters='jest-junit'
                ls -lat
              '''
            }
          }
        }        

      }

      post {
        always {
          junit skipPublishingChecks: true, testResults: 'lambda/schoolHandler/junit.xml'

          clover(cloverReportDir: '../coverage', cloverReportFileName: 'clover.xml',
            // optional, default is: method=70, conditional=80, statement=80
            healthyTarget: [methodCoverage: 70, conditionalCoverage: 80, statementCoverage: 80],
            // optional, default is none
            unhealthyTarget: [methodCoverage: 50, conditionalCoverage: 50, statementCoverage: 50],
            // optional, default is none
            failingTarget: [methodCoverage: 0, conditionalCoverage: 0, statementCoverage: 0]
          )
        }
      }
    } // End - stage unit tests


    stage('Package Lambda') {

      when {
        allOf {
          expression { branch "main" }
          expression { ENVIRONMENT_DEPLOY != "" }
          expression { ENVIRONMENT_DEPLOY != "preprod" }
          expression { ENVIRONMENT_DEPLOY != "prod" }
          expression { ENVIRONMENT_DEPLOY != "prodsupport" }
        }
      }

      parallel {
        stage('Package schoolHandler') {
          steps {
            dir('lambda/schoolHandler') {
              sh '''
                npm run package
              '''
            }
          }
        }
        stage('Package staffHandler') {
          steps {
            dir('lambda/staffHandler') {
              sh '''
                npm run package
              '''
            }
          }
        }
        stage('Package studentHandler') {
          steps {
            dir('lambda/studentHandler') {
              sh '''
                npm run package
              '''
            }
          }
        }
      } // End parallel
    } // End Stage package

    stage('Download Release') {

      when {
        allOf {
          expression { branch "release/*" }
          expression { ENVIRONMENT_DEPLOY == "prod" || ENVIRONMENT_DEPLOY == "preprod" || ENVIRONMENT_DEPLOY == "prodsupport" }
        }
      }

      steps {
        script {
          sh '''
          RELEASE_NUMBER=$(echo "${BRANCH_NAME}" | cut -d "/" -f 2)
          echo downloading release ${RELEASE_NUMBER}
          aws sts get-caller-identity

          aws s3 cp s3://doeintegration-jenkinsreleases-storage-tools-s3/payld/${RELEASE_NUMBER}/lambda_schoolHandler_function_${RELEASE_NUMBER}.zip ./lambda/schoolHandler/function.zip
          aws s3 cp s3://doeintegration-jenkinsreleases-storage-tools-s3/payld/${RELEASE_NUMBER}/lambda_staffHandler_function_${RELEASE_NUMBER}.zip ./lambda/staffHandler/function.zip
          aws s3 cp s3://doeintegration-jenkinsreleases-storage-tools-s3/payld/${RELEASE_NUMBER}/lambda_studentHandler_function_${RELEASE_NUMBER}.zip ./lambda/studentHandler/function.zip
          '''
        }
      }
    } // End Stage - Download release

    stage('Deploy') {

      when {
        anyOf {
          allOf {
            expression { branch "main" }
            anyOf {
                expression { ENVIRONMENT_DEPLOY == "dev"}
                expression { ENVIRONMENT_DEPLOY == "test"}
            }
          }

          allOf {
            expression { branch "release/*" }
            anyOf {
                expression { ENVIRONMENT_DEPLOY == "preprod"}
                expression { ENVIRONMENT_DEPLOY == "prod"}
                expression { ENVIRONMENT_DEPLOY == "prodsupport"}
            }
          }
        }
      }

      steps {
        script { //TODO remember to add terraspace up command by copying from main branch
          sh '''
          	eval $(aws sts assume-role --role-arn "arn:aws:iam::${ACCOUNT_ID}:role/app-iam-role-entint-default-ci-exec" --role-session-name "terraspace_provisioning" | jq -r '.Credentials | "export AWS_ACCESS_KEY_ID=\\(.AccessKeyId)\nexport AWS_SECRET_ACCESS_KEY=\\(.SecretAccessKey)\nexport AWS_SESSION_TOKEN=\\(.SessionToken)\n"')

            bundle config set --local path gems
            bundle install
            bundle update

            tags="{cir_app_id = \\"ischem\\", cir_dataclass = \\"sensitive\\", Integration-Env = \\"${ENVIRONMENT_DEPLOY}\\", Integration-Component-Name = \\"SchoolCommsAdapter\\", Integration-Version = \\"v1\\", Integration-Branch = \\"${BRANCH_NAME}\\", Integration-User = \\"${BUILD_USER}\\", Integration-Repository = \\"https://bitbucket.det.nsw.edu.au/scm/entint/schoolemergencynotificationservice.git\\"}"
			
            export TS_VERSION_CHECK=0
            export TS_ENV=${ENVIRONMENT_DEPLOY}
            export TF_VAR_staff_db_username=${STAFF_DB_USERNAME}
            export TF_VAR_staff_db_password=${STAFF_DB_PASSWORD}
			bundle exec terraspace up school-emergency-notification -y -var "tags=${tags}"
          '''
        }
      }
    }
    // End - Stage Deploy
    stage('Run Integration Tests') {

      when {
        anyOf {
          allOf {
            expression { branch "main" }
            expression { ENVIRONMENT_DEPLOY == "dev" || ENVIRONMENT_DEPLOY == "test"}
          }

          allOf {
            expression { branch "release/*" }
            expression { ENVIRONMENT_DEPLOY == "preprod" || ENVIRONMENT_DEPLOY == "prod" || ENVIRONMENT_DEPLOY == "prodsupport" }
            expression { RELEASE_NUMBER != "" }
          }
        }
      }

      environment {
        API_ENDPOINT = sh(returnStdout:true, script: '''
          eval $(aws sts assume-role --role-arn "arn:aws:iam::${ACCOUNT_ID}:role/app-iam-role-entint-default-ci-exec" --role-session-name "terraspace_provisioning" | jq -r '.Credentials | "export AWS_ACCESS_KEY_ID=\\(.AccessKeyId)\nexport AWS_SECRET_ACCESS_KEY=\\(.SecretAccessKey)\nexport AWS_SESSION_TOKEN=\\(.SessionToken)\n"')
          export TS_VERSION_CHECK=0
          export TS_ENV=${ENVIRONMENT_DEPLOY}
          bundle exec terraspace output school-emergency-notification -json | jq -r '.api_endpoint.value'
        ''').trim()
		
      }

      parallel {
        stage('Run School Lambda Integration tests') {
          steps {
            dir('lambda/schoolHandler') {
              sh '''
                eval $(aws sts assume-role --role-arn "arn:aws:iam::${ACCOUNT_ID}:role/app-iam-role-entint-default-ci-exec" --role-session-name "terraspace_provisioning" | jq -r '.Credentials | "export AWS_ACCESS_KEY_ID=\\(.AccessKeyId)\nexport AWS_SECRET_ACCESS_KEY=\\(.SecretAccessKey)\nexport AWS_SESSION_TOKEN=\\(.SessionToken)\n export TS_ENV=${ENVIRONMENT_DEPLOY}"')
                npm run testIntegration @${ENVIRONMENT_DEPLOY}
              '''
            }
          }
        }

        stage('Run Staff Lambda Integration tests') {
          steps {
            dir('lambda/staffHandler') {
              sh '''
                eval $(aws sts assume-role --role-arn "arn:aws:iam::${ACCOUNT_ID}:role/app-iam-role-entint-default-ci-exec" --role-session-name "terraspace_provisioning" | jq -r '.Credentials | "export AWS_ACCESS_KEY_ID=\\(.AccessKeyId)\nexport AWS_SECRET_ACCESS_KEY=\\(.SecretAccessKey)\nexport AWS_SESSION_TOKEN=\\(.SessionToken)\n export TS_ENV=${ENVIRONMENT_DEPLOY}"')
                npm run testIntegration @${ENVIRONMENT_DEPLOY}
              '''
            }
          }
        }

        stage('Run Student Lambda Integration tests') {
          steps {
            dir('lambda/studentHandlerHandler') {
              sh '''
                eval $(aws sts assume-role --role-arn "arn:aws:iam::${ACCOUNT_ID}:role/app-iam-role-entint-default-ci-exec" --role-session-name "terraspace_provisioning" | jq -r '.Credentials | "export AWS_ACCESS_KEY_ID=\\(.AccessKeyId)\nexport AWS_SECRET_ACCESS_KEY=\\(.SecretAccessKey)\nexport AWS_SESSION_TOKEN=\\(.SessionToken)\n export TS_ENV=${ENVIRONMENT_DEPLOY}"')
                npm run testIntegration @${ENVIRONMENT_DEPLOY}
              '''
            }
          }
        }         
      }
      //TODO uncomment below lines individually -
      post {
        always {
           //TODO copy below deleted line from older branch
           cucumber fileIncludePattern: 'lambda/*/tests/cucumber-report.json'          
        }
      }
    }  //End -stage Integration tests

  } // End - Stages

  post {
    // Clean after build
    always {
      cleanWs(cleanWhenNotBuilt: false, deleteDirs: true, disableDeferredWipeout: true, notFailBuild: true, patterns: [[pattern: '.gitignore', type: 'INCLUDE']])
    }
  }
}

def getAccountId(environment) {

  if(environment.equals("test")) {
    return "959024001480"
  }

  if(environment.equals("preprod")) {
    return "294057591299"
  }

  if(environment.equals("prodsupport")) {
    return "294057591299"
  }

  if(environment.equals("prod")) {
    return "862534675796"
  }

  // Defaults to dev account
  return "318468042250"
}