pipeline {
    agent any

    environment {
        SERVER_IP = credentials('DO_SENTRY2')
        PROD_NAME = "prod_${env.BUILD_NUMBER}"
    }

    stages {
        stage('Ssh and deploy') {
            steps {
                sshagent(['phu-cloud']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no -l root $SERVER_IP <<EOF
                            cd /mnt/volume_nyc3_03/owallet
                            git pull origin develop
                            echo "DONE pull source code"
                    '''
                }

                sshagent(['phu-cloud']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no -l root $SERVER_IP <<EOF
                            cd /mnt/volume_nyc3_03/owallet
                            yarn
                            yarn build:libs
                            yarn
                            cd packages/extension
                            yarn build
                            echo "DONE build artifact"
                            zip -r /mnt/volume_nyc3_03/oraiscan-backend/static/$PROD_NAME prod/
                    '''
                }
            }
        }
    }
    post {
        success {
            discordSend description: "Build new artifact in url: https://do2.scan.orai.io/${env.PROD_NAME}", footer: '', image: '', link: '', result: '', thumbnail: '', title: '[extension-artifact] [do-sentry2]', webhookURL: 'https://discord.com/api/webhooks/987298208751427584/Nu2Bc6BS5llTmcZjT80q6lpUrzmgE0aA23B7-NmqTAvbMAeBZFNsiYaRMO3kv1cERCQj'
        }
    }
}
