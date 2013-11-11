all: about.html api.html index.html

index.html: index.md
	marked -o index.html index.md

about.html: about.md
	marked -o about.html about.md

api.html: api.md
	marked -o api.html api.md

commit: about.html api.html
	git commit -m 'New build' about.html about.md api.html api.md

deploy: commit
	git push
