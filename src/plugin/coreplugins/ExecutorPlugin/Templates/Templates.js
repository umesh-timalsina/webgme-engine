/* Generated file based on ejs templates */
define([], function() {
    return {
    "generate_name.py.ejs": "import os\r\nimport json\r\nimport sys\r\nimport logging\r\nimport time\r\n\r\n## Setup a logger\r\n# Create logger with 'spam_application'.\r\nlogger = logging.getLogger()\r\nlogger.setLevel(logging.DEBUG)\r\n\r\n# Create file handler which logs even debug messages.\r\nif not os.path.isdir('log'):\r\n    os.mkdir('log')\r\n\r\nfh = logging.FileHandler(os.path.join('log', 'execute.log'))\r\nfh.setLevel(logging.DEBUG)\r\n\r\n# Create console handler with a higher log level.\r\nch = logging.StreamHandler(sys.stdout)\r\nch.setLevel(logging.INFO)\r\n\r\n# Create formatter and add it to the handlers.\r\nformatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')\r\nfh.setFormatter(formatter)\r\nch.setFormatter(formatter)\r\n\r\n# Add the handlers to the logger.\r\nlogger.addHandler(fh)\r\nlogger.addHandler(ch)\r\n\r\nif __name__ == '__main__':\r\n    logger.info('generate_name script started.')\r\n    if len(sys.argv) < 2:\r\n        logger.error('Provide a path to the active node!')\r\n        sys.exit(1)\r\n    active_node_path = sys.argv[1]\r\n    logger.info('active node path : {0}'.format(active_node_path))\r\n    with open('new_name.json', 'wb') as f_out:\r\n        json.dump({active_node_path: 'ThisIsANewName'}, f_out)\r\n    logger.info('created new_name.json')\r\n    cnt = 0\r\n    logger.info('output_{0}'.format(cnt))\r\n    cnt += 1\r\n    logger.info('output_{0}'.format(cnt))\r\n    cnt += 1\r\n    logger.info('output_{0}'.format(cnt))\r\n    cnt += 1\r\n    logger.info('output_{0}'.format(cnt))\r\n    cnt += 1\r\n    logger.info('output_{0}'.format(cnt))\r\n    cnt += 1\r\n\r\n    logger.info('1 Going to sleep for {0} seconds.. zzZzZZ'.format(<%=sleepTime%>))\r\n    time.sleep(<%=sleepTime%>)\r\n    logger.info('1 Good Morning!')\r\n\r\n    logger.info('output_{0}'.format(cnt))\r\n    cnt += 1\r\n    logger.info('output_{0}'.format(cnt))\r\n    cnt += 1\r\n    logger.info('output_{0}'.format(cnt))\r\n    cnt += 1\r\n    logger.info('output_{0}'.format(cnt))\r\n    cnt += 1\r\n    logger.info('output_{0}'.format(cnt))\r\n    cnt += 1\r\n\r\n    logger.info('2 Going to sleep again for {0} seconds.. zzZzZZ'.format(<%=sleepTime%>))\r\n    time.sleep(<%=sleepTime%>)\r\n    logger.info('2 Good Morning!')\r\n\r\n    logger.info('output_{0}'.format(cnt))\r\n    cnt += 1\r\n    logger.info('output_{0}'.format(cnt))\r\n    cnt += 1\r\n    logger.info('output_{0}'.format(cnt))\r\n    cnt += 1\r\n    logger.info('output_{0}'.format(cnt))\r\n    cnt += 1\r\n    logger.info('output_{0}'.format(cnt))\r\n\r\n    logger.info('Will exit with code {0}'.format(<%=exitCode%>))\r\n    sys.exit(<%=exitCode%>)"
}});