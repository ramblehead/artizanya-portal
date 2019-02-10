;; -*- coding: utf-8 -*-

(set (make-local-variable 'tide-tsserver-executable)
     (concat (rh-project-get-root) "node_modules/.bin/tsserver"))

(set (make-local-variable 'flycheck-typescript-tslint-executable)
     (concat (rh-project-get-root) "node_modules/.bin/tslint"))

(let ((project-root (rh-project-get-root))
      file-rpath ext-js)
  (when project-root
    (setq file-rpath (abbreviate-file-name
                      (expand-file-name buffer-file-name project-root)))
    (cond ((string-match-p "\\.ts\\'\\|\\.tsx\\'" file-rpath)
           (rh-setup-typescript-tide))
          ((or (string-match-p "^#!.*node" (save-excursion
                                             (goto-char (point-min))
                                             (thing-at-point 'line t)))
               (setq ext-js (string-match-p "\\.js\\'"
                                            file-rpath)))
           ;; tsserver requires non-.ts files to be manually added to the files
           ;; array in tsconfig.json, otherwise the file will be loaded as part
           ;; of an 'inferred project'. This won't be necessary anymore after
           ;; TypeScript allows defining custom file
           ;; extensions. https://github.com/Microsoft/TypeScript/issues/8328
           (unless ext-js (setq tide-require-manual-setup t))
           (setq rh-js2-additional-externs
                 (append rh-js2-additional-externs '("require" "exports")))
           (rh-setup-javascript-tern-tide))
          ((string-match-p "\\.jsx\\'" file-rpath)
           (rh-setup-javascript-tern-tide)))))
