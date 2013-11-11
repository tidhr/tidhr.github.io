all: about.html api.html

about.html: about.md
	marked -o about.html about.md

api.html: api.md
	marked -o api.html api.md

commit: about.html api.html
	git commit -m 'New build' about.html about.md api.html api.md

deploy: commit
	git push
