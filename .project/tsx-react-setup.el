;; -*- coding: utf-8 -*-

(set (make-local-variable 'tide-tsserver-executable)
     (concat (rh-project-get-root) "node_modules/.bin/tsserver"))

(set (make-local-variable 'tern-command)
     (list (concat (rh-project-get-root) "node_modules/.bin/tern")))

(set (make-local-variable 'rh-tern-argument-hints-enabled) nil)

(rh-tsx-react-setup)
