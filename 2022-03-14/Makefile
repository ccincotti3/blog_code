all:methods 

methods: methods.o
	gcc methods.o -o out -l m

methods.o: methods.c
	gcc -c methods.c

clean:
	rm -f *.o *.txt *.c.swp out