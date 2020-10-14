
import requests
from db import alux_collection

github_id = 'lill74'
github_token = '71cbcbf9ebbe69290d0d8049b85d6bfe81504b4c'
my_auth = (github_id, github_token)

alux_collection.drop()

def add_data_to_database(data):
    if alux_collection.find_one({'id': int(data['id'])}) is None:
        print(data['id'])
        alux_collection.insert_one(data)

def retrieve_data(repo):

    issues = requests.get(url=f"https://api.github.com/repos/{repo}/issues", auth=my_auth).json()


    for issue in issues:
        labels = {}
        for label in issue['labels']:
            labels[label['name']] =  '#' + label['color']

        repo_name = issue['repository_url'][29:]

        data = {
            'id': issue['id'],
            'issueHref': issue['html_url'],
            'issueName': issue['title'],
            'repoName': repo_name,
            'repoHref': 'https://github.com/' + repo_name,
            'article': issue['body'],
            'labels': labels
        }

        add_data_to_database(data)

repos = [
    'taetaetae/github-repo-searcher',
    'jinseobhong/git.study-react-samples',
    'libreoffice-kr/autocorr_kr',
    'anencore94/SlidingWindowGenerator',
    'phg98/hacktoberfestkorea',
    'CodeSeoul/codeseoul.github.io',
    'zeebraa00/SCG_freshman_mission',
    'devrel-kr/hacktoberfest-seoul',
    'Reinose/Useful-IDAScripts',
    'Road-of-CODEr/computer-science',
    'aliencube/bicep-build-actions',
    'aliencube/arm-ttk-actions',
    'spoqa/LongPressListener',
    'Road-of-CODEr/one-percent-network',
    'sboh1214/HwpKit',
    'Road-of-CODEr/clean-code',
    'spoqa/StickyScrollView',
    'Haeuncs/RetroPhotoEditor',
    'phg98/phg98p5sample',
    'hahnlee/hwp.js',
    'techoi/travis-pr',
    'wslhub/WslManager',
    'sople1/bung_calc',
    'keunyop/badwordcheck-web',
    'ksjae/ai-text-adventure',
    'junhoyeo/react-mobile-sized-view',
    'ShoyuVanilla/FoundryVTT-CGMP',
    'ShoyuVanilla/FoundryVTT-Chat-Portrait',
    'channprj/us-twitter-shortcuts',
    'Seo-Rii/electron-acrylic-window',
    'sople1/pyKilldow',
    'hackrslab/studyolle',
    'junhoyeo/react-native-bubble-tabbar',
    'RieLCho/Discord_DGUcafeteria',
    'koreanbots/client',
    'mingrammer/diagrams',
    'aliencube/microsoft-teams-actions',
    'pcr910303/HackerNews',
    'wonderlandpark/wonderbot',
    'parksb/handmade-blog',
    'INMD1/javabot-KR',
    'ericswpark/linux_setup',
    'GimunLee/tech-refrigerator',
    'davimatyi/nut-app',
    'BusHanyang/ERICA_shuttlecock_API',
    'lovefields/dragonEditor',
    'sople1/slosk',
    'channprj/google-search-navigator',
    'keunyop/quizeey',
    'pcr910303/cl-cowsay',
    'sople1/node-inet-refresh',
    'sople1/go-inet-refresh',
    'litemint/litemint',
    'jeongwhanchoi/hacktoberfest-for-beginners',
    'jeongwhanchoi/algorithms',
    'ksjae/Meals',
    'ugnelis/ros_cameras_controller',
    'sukso96100/parktana-memes',
    'KimWooHyun/resume'
]

for repo in repos:
    retrieve_data(repo=repo)