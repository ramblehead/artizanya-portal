;; -*- coding: utf-8 -*-

(set (make-local-variable 'tide-tsserver-executable)
     (concat (rh-project-get-root) "node_modules/.bin/tsserver"))

(set (make-local-variable 'tern-command)
     (list (concat (rh-project-get-root) "node_modules/.bin/tern")))

(set (make-local-variable 'rh-tern-argument-hints-enabled) nil)

(let ((project-root (rh-project-get-root))
      file-rpath)
  (when project-root
    (setq file-rpath (file-relative-name buffer-file-name project-root))
    (cond ((string-match-p "\\.ts\\'\\|\\.tsx\\'" file-rpath)
           (rh-typescript-setup))
          ((string-match-p "\\.js\\'" file-rpath)
           (rh-javascript-setup)))))
