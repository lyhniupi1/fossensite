import traceback

from cronjob import prepare, setup_django, run, format_results, send_email


def main():
    prepare()
    results = []
    try:
        results.append(run('git pull'))
        results[-1].check_returncode()
        if results[-1].stdout == 'Already up-to-date.\n':
            #no need to continue
            return 0

        results.append(run('python3 manage.py makemigrations'))
        results[-1].check_returncode()
        if results[-1].stdout != 'No changes detected\n':
            results.append(run('python3 manage.py migrate'))
            results[-1].check_returncode()

        results.append(run('apachectl restart'))
        if results[-1].returncode:
            error_result = results[-1]
            results.append(run('apachectl status'))
            if 'Active: active (running)' not in results[-1].stdout:
                results.append(run('git reset --hard HEAD^'))
                results.append(run('apachectl restart'))
            error_result.check_returncode()

    except Exception:
        message = '部署过程中发生了错误！\n\n' + traceback.format_exc() + '\n'
    else:
        message = '部署完成\n'

    results.append(run('chown -R fossen:root /usr/fossen/website/fossensite'))

    setup_django()
    send_email('www.fossen.cn | 自动部署结果', message + format_results(results))

main()